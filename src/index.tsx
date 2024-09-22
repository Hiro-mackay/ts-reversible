import { Hono } from "hono";
import { logger } from "hono/logger";
import { renderToString } from "react-dom/server";
import { db } from "./db";
import { games, moves, squares, turns } from "./db/schema";
import {
  BLACK,
  EMPTY,
  INITIAL_BOARD,
  INITIAL_TURN_COUNT,
  WHITE,
} from "./consts/game";
import { and, desc, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { hc } from "hono/client";
import { GameGateway } from "./dataaccess/game-gateway";
import { TurnGateway } from "./dataaccess/turn-gateway";
import { MoveGateway } from "./dataaccess/move-gateway";
import { SquareGateway } from "./dataaccess/square-gateway";

const app = new Hono();
const apiRoutes = app.basePath("/api");

// Middleware
app.use(logger());
app.onError((e, c) => {
  console.error(`${e}`);
  return c.text("Internal Server Error", 500);
});

const gameGateway = new GameGateway();
const turnGateway = new TurnGateway();
const moveGateway = new MoveGateway();
const squareGateway = new SquareGateway();

const routes = apiRoutes
  .post("/games", async (c) => {
    const now = new Date();

    const gameRecord = await gameGateway.insert(db, now);

    const gameId = gameRecord?.id;

    const turnRecord = await turnGateway.insert(
      db,
      gameId,
      INITIAL_TURN_COUNT,
      BLACK,
      now
    );

    await squareGateway.insertAll(db, turnRecord.id, INITIAL_BOARD);

    return c.json({}, 201);
  })
  .get(
    "/games/latest/turns/:turnCount",
    zValidator(
      "param",
      z.object({
        turnCount: z.number(),
      })
    ),
    async (c) => {
      const turnCount = c.req.valid("param").turnCount;

      const gameRecord = await gameGateway.findLatest(db);

      if (!gameRecord) {
        throw new Error("Latest game not found");
      }

      const turnRecord = await turnGateway.fondByIdAndTurnCount(
        db,
        gameRecord.id,
        turnCount
      );

      if (!turnRecord) {
        throw new Error("Specified turn not found");
      }

      const squareRecord = await squareGateway.findByTurnId(db, turnRecord.id);

      if (!squareRecord) {
        throw new Error("Squares not found");
      }

      const board = INITIAL_BOARD.map((line, y) => line.map((_, x) => EMPTY));
      squareRecord.forEach((square) => {
        board[square.y][square.x] = square.disc;
      });

      return c.json({
        turnCount,
        board,
        winner: null,
        nextDisc: turnRecord.nextDisc,
      });
    }
  )
  .post(
    "/games/latest/turns",
    zValidator(
      "json",
      z.object({
        turnCount: z.number(),
        disc: z.number(),
        x: z.number(),
        y: z.number(),
      })
    ),
    async (c) => {
      const { turnCount, disc, x, y } = c.req.valid("json");
      const previousTurnCount = turnCount - 1;

      // 前の盤面を取得
      const gameRecord = await gameGateway.findLatest(db);

      if (!gameRecord) {
        throw new Error("Latest game not found");
      }
      const gameId = gameRecord.id;

      const previousTurnRecord = await turnGateway.fondByIdAndTurnCount(
        db,
        gameId,
        previousTurnCount
      );

      if (!previousTurnRecord) {
        throw new Error("Previous turn not found");
      }

      const squareRecord = await squareGateway.findByTurnId(
        db,
        previousTurnRecord.id
      );

      if (!squareRecord) {
        throw new Error("Squares not found");
      }

      const board = INITIAL_BOARD.map((line, y) => line.map((_, x) => EMPTY));
      squareRecord.forEach((square) => {
        board[square.y][square.x] = square.disc;
      });

      // 石を置く
      board[y][x] = disc;

      // ターンを保存
      const now = new Date();
      const nextDisc = disc === BLACK ? WHITE : BLACK;

      const turnRecord = await turnGateway.insert(
        db,
        gameId,
        turnCount,
        nextDisc,
        now
      );

      await squareGateway.insertAll(db, turnRecord.id, board);

      await moveGateway.insert(db, turnRecord.id, disc, x, y);

      return c.text("OK", 201);
    }
  );

app.get("*", (c) => {
  return c.html(
    renderToString(
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          {import.meta.env.PROD ? (
            <>
              <link rel="stylesheet" href="/static/assets/style.css" />
              <script type="module" src="/static/client.js"></script>
            </>
          ) : (
            <>
              <link rel="stylesheet" href="/src/style.css" />
              <script type="module" src="/src/client.tsx"></script>
            </>
          )}
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    )
  );
});

export type AppType = typeof routes;

export default app;
