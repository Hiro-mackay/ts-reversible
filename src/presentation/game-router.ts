import { Hono } from "hono";
import { StartNewGameUseCase } from "../application/use-case/start-new-game-use-case";
import { GamePgRepository } from "../infrastructure/repository/game/game-pg-repository";
import { TurnPgRepository } from "../infrastructure/repository/turn/turn-pg-repository";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { RegisterTurnUseCase } from "../application/use-case/register-turn-use-case";
import { GameResultPgRepository } from "../infrastructure/repository/game-result/game-result-pg-repository";
import { FindGameTurnUseCase } from "../application/use-case/find-game-turn-use-case";
import { toDisc } from "../domain/model/turn/disc";
import { Point } from "../domain/model/turn/point";
import { FindLatestGameTurnUseCase } from "../application/use-case/find-latest-game-turn-use-case";

const startNewGameUseCase = new StartNewGameUseCase(
  new GamePgRepository(),
  new TurnPgRepository()
);

const registerTurnUseCase = new RegisterTurnUseCase(
  new GamePgRepository(),
  new TurnPgRepository(),
  new GameResultPgRepository()
);

const findGameTurnUseCase = new FindGameTurnUseCase(
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
  .post("/", async (c) => {
    const game = await startNewGameUseCase.run();
    return c.json(
      {
        id: game.id,
        startedAt: game.startedAt,
      },
      201
    );
  })
  .get(
    "/:gameId/turns/latest",
    zValidator(
      "param",
      z.object({
        gameId: z.string(),
      }),
      (result) => {
        if (!result.success) {
          throw result.error;
        }
      }
    ),
    async (c) => {
      const gameId = Number(c.req.valid("param").gameId);
      const responseData = await findLatestGameTurnUseCase.run(gameId);

      return c.json(responseData);
    }
  )
  .get(
    "/:gameId/turns/:turnCount",
    zValidator(
      "param",
      z.object({
        gameId: z.string(),
        turnCount: z.string(),
      }),
      (result) => {
        if (!result.success) {
          throw result.error;
        }
      }
    ),
    async (c) => {
      const gameId = Number(c.req.valid("param").gameId);
      const turnCount = Number(c.req.valid("param").turnCount);

      const responseData = await findGameTurnUseCase.run(gameId, turnCount);

      return c.json(responseData);
    }
  )
  .post(
    "/:gameId/turns",
    zValidator("param", z.object({ gameId: z.string() }), (result) => {
      if (!result.success) {
        throw result.error;
      }
    }),
    zValidator(
      "json",
      z.object({
        turnCount: z.number(),
        move: z.object({ disc: z.number(), x: z.number(), y: z.number() }),
      }),
      (result) => {
        if (!result.success) {
          throw result.error;
        }
      }
    ),
    async (c) => {
      const gameId = Number(c.req.valid("param").gameId);
      const { turnCount, move } = c.req.valid("json");
      const disc = toDisc(move.disc);
      const point = new Point(move.x, move.y);

      await registerTurnUseCase.run(gameId, turnCount, disc, point);

      return c.text("OK", 201);
    }
  );
