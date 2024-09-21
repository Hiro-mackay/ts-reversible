import { Hono } from "hono";
import { logger } from "hono/logger";
import { renderToString } from "react-dom/server";
import { db } from "./db";
import { games, squares, turns } from "./db/schema";
import { BLACK, EMPTY, INITIAL_BOARD } from "./consts/game";
import { and, desc, eq } from "drizzle-orm";

const app = new Hono();

// Middleware
app.use(logger());
app.onError((e, c) => {
  console.error(`${e}`);
  return c.text("Internal Server Error", 500);
});

app.post("/api/games", async (c) => {
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
});

app.get("/api/games/latest/turns/:turnCount", async (c) => {
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

  if (squaresResult.length === 0) {
    return c.json({ error: "Not Found" }, 404);
  }

  const board = INITIAL_BOARD.map((line, y) => line.map((_, x) => EMPTY));
  squaresResult.forEach((square) => {
    board[square.y][square.x] = square.disc;
  });

  return c.json({
    turnCount,
    board,
    nextDisc: turnResult[0].nextDisc,
    innerDisc: null,
  });
});

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

export default app;
