import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { FindLatestGameTurnUseCase } from "../application/use-case/find-latest-game-turn-use-case";
import { Point } from "../domain/model/turn/point";
import { toDisc } from "../domain/model/turn/disc";
import { GamePgRepository } from "../infrastructure/repository/game/game-pg-repository";
import { TurnPgRepository } from "../infrastructure/repository/turn/turn-pg-repository";
import { GameResultPgRepository } from "../infrastructure/repository/game-result/game-result-pg-repository";
import { RegisterTurnUseCase } from "../application/use-case/register-turn-use-case";

const registerTurnUseCase = new RegisterTurnUseCase(
  new GamePgRepository(),
  new TurnPgRepository(),
  new GameResultPgRepository()
);

const findLatestGameTurnUseCase = new FindLatestGameTurnUseCase(
  new GamePgRepository(),
  new TurnPgRepository(),
  new GameResultPgRepository()
);

// base path id "/api/games/latest"
export const app = new Hono()
  .get(
    "/:turnCount",
    zValidator(
      "param",
      z.object({
        turnCount: z.string(),
      })
    ),
    async (c) => {
      const turnCount = Number(c.req.valid("param").turnCount);

      const responseData = await findLatestGameTurnUseCase.run(turnCount);

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
        move: z.object({ disc: z.number(), x: z.number(), y: z.number() }),
      })
    ),
    async (c) => {
      const { turnCount, move } = c.req.valid("json");
      const disc = toDisc(move.disc);
      const point = new Point(move.x, move.y);

      await registerTurnUseCase.run(turnCount, disc, point);

      return c.text("OK", 201);
    }
  );
