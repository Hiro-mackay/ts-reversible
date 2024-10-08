import { Hono } from "hono";
import { logger } from "hono/logger";
import { renderToString } from "react-dom/server";
import { app as GameRouter } from "./presentation/game-router";
import { app as ResultRouter } from "./presentation/result-router";
import { DomainError } from "./domain/error/domain-error";
import { ApplicationError } from "./application/error/application-error";
import { ZodError } from "zod";

const app = new Hono();

// Middleware
app.use(logger());
app.onError((e, c) => {
  console.error("server error", `${e}`);

  if (e instanceof DomainError) {
    return c.json(
      {
        error: {
          type: e.type,
          message: e.message,
        },
      },
      400
    );
  }

  if (e instanceof ApplicationError) {
    const statusCode = (() => {
      switch (e.type) {
        case "LatestGameNotFound":
          return 404;

        default:
          return 400;
      }
    })();

    return c.json(
      {
        error: {
          type: e.type,
          message: e.message,
        },
      },
      statusCode
    );
  }

  if (e instanceof ZodError) {
    return c.json(
      {
        error: {
          type: "ValidationError",
          message: e.message,
          errors: e.errors,
        },
      },
      400
    );
  }

  return c.json(
    {
      error: {
        type: "InternalServerError",
        message: "Internal Server Error",
      },
    },
    500
  );
});

const routes = app
  .basePath("/api")
  .route("/games", GameRouter)

  // @todo: refactored to use ResultRouter
  .route("/result", ResultRouter);

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

export type AppTypes = typeof routes;

export default app;
