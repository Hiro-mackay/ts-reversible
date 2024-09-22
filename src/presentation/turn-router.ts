import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { TurnService } from "../service/turn-service";

const turnService = new TurnService();

// base path id "/api/games/latest"
export const app = new Hono()
  .get(
    "/:turnCount",
    zValidator(
      "param",
      z.object({
        turnCount: z.number(),
      })
    ),
    async (c) => {
      const turnCount = c.req.valid("param").turnCount;

      const responseData = await turnService.findLatestTurn(turnCount);

      return c.json({
        ...responseData,
      });
    }
  )
  .post(
    "/",
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

      await turnService.registerTurn(turnCount, disc, x, y);

      return c.text("OK", 201);
    }
  );
