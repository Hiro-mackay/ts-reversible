import { Hono } from "hono";
import { logger } from "hono/logger";
import { renderToString } from "react-dom/server";
import { db } from "./db";
import { games } from "./db/schema";

const app = new Hono();

// Middleware
app.use(logger());
app.onError((e, c) => {
  console.error(`${e}`);
  return c.text("Internal Server Error", 500);
});

app.post("/api/games", async (c) => {
  try {
    await db.insert(games).values({ startedAt: new Date() });

    return c.json({}, 201);
  } catch (error) {
    console.error(error);
    return c.json({ error }, 400);
  }
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
