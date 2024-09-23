import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { FindGameResultsUseCase } from "../application/use-case/find-game-result-use-case";
import { FindGameResultsPgQueryService } from "../infrastructure/query/find-game-result-pg-query-serivce";

const findGameResultsUseCase = new FindGameResultsUseCase(
  new FindGameResultsPgQueryService()
);

// base path id "/api/result"
export const app = new Hono().get(
  "/games",
  zValidator(
    "query",
    z.object({
      limit: z.number().optional(),
    }),
    (result) => {
      if (!result.success) {
        throw result.error;
      }
    }
  ),
  async (c) => {
    const limit = c.req.valid("query").limit;
    const games = await findGameResultsUseCase.run(limit || 999);
    return c.json(games);
  }
);
