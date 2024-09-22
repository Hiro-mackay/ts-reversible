import { Hono } from "hono";
import { logger } from "hono/logger";
import { renderToString } from "react-dom/server";
import { db } from "./db";
import { games, moves, squares, turns } from "./db/schema";
import { BLACK, EMPTY, INITIAL_BOARD, WHITE } from "./consts/game";
import { and, desc, eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { hc } from "hono/client";

const app = new Hono();
const apiRoutes = app.basePath("/api");

// Middleware
app.use(logger());
app.onError((e, c) => {
  console.error(`${e}`);
  return c.text("Internal Server Error", 500);
});

const routes = apiRoutes
  .post("/games", async (c) => {
    const now = new Date();

    const gameResult = await db
      .insert(games)
      .values({ startedAt: now })
      .returning();

    const gameId = gameResult[0].id;

    const turnResult = await db
      .insert(turns)
      .values({
        gameId,
        turnCount: 0,
        nextDisc: BLACK,
        endedAt: now,
      })
      .returning();

    const turnId = turnResult[0].id;

    const squaresData: {
      turnId: number;
      x: number;
      y: number;
      disc: number;
    }[] = INITIAL_BOARD.flatMap((line, y) =>
      line.map((disc, x) => ({ turnId, x, y, disc }))
    );

    await db.insert(squares).values(squaresData);

    return c.json({}, 201);
  })
  .get("/games/latest/turns/:turnCount", async (c) => {
    const turnCount = c.req.param("turnCount");

    const gameResult = await db
      .select()
      .from(games)
      .orderBy(desc(games.id))
      .limit(1);

    const turnResult = await db
      .select()
      .from(turns)
      .where(
        and(
          eq(turns.gameId, gameResult?.[0].id),
          eq(turns.turnCount, Number(turnCount))
        )
      );

    const squaresResult = await db
      .select()
      .from(squares)
      .where(eq(squares.turnId, turnResult?.[0].id));

    const board = INITIAL_BOARD.map((line, y) => line.map((_, x) => EMPTY));
    squaresResult.forEach((square) => {
      board[square.y][square.x] = square.disc;
    });

    return c.json({
      turnCount,
      board,
      winner: null,
      nextDisc: turnResult[0].nextDisc,
    });
  })
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
      const gameQueryResult = await db
        .select()
        .from(games)
        .orderBy(desc(games.id))
        .limit(1);

      const gameId = gameQueryResult?.[0].id;

      const turnQueryResult = await db
        .select()
        .from(turns)
        .where(
          and(eq(turns.gameId, gameId), eq(turns.turnCount, previousTurnCount))
        );

      const squaresQueryResult = await db
        .select()
        .from(squares)
        .where(eq(squares.turnId, turnQueryResult?.[0].id));

      const board = INITIAL_BOARD.map((line, y) => line.map((_, x) => EMPTY));
      squaresQueryResult.forEach((square) => {
        board[square.y][square.x] = square.disc;
      });

      // 石を置く
      board[y][x] = disc;

      // ターンを保存
      const now = new Date();
      const nextDisc = disc === BLACK ? WHITE : BLACK;

      const turnInsertResult = await db
        .insert(turns)
        .values({
          gameId,
          turnCount,
          nextDisc,
          endedAt: now,
        })
        .returning();

      const turnId = turnInsertResult[0].id;

      const squaresData: {
        turnId: number;
        x: number;
        y: number;
        disc: number;
      }[] = board.flatMap((line, y) =>
        line.map((disc, x) => ({ turnId, x, y, disc }))
      );

      await db.insert(squares).values(squaresData);

      await db.insert(moves).values({
        turnId,
        x,
        y,
        disc,
      });

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
