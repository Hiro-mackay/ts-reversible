import { Hono } from "hono";
import { StartNewGameUseCase } from "../application/use-case/start-new-game-use-case";
import { GamePgRepository } from "../infrastructure/repository/game/game-pg-repository";
import { TurnPgRepository } from "../infrastructure/repository/turn/turn-pg-repository";

const startNewGameUseCase = new StartNewGameUseCase(
  new GamePgRepository(),
  new TurnPgRepository()
);

// base path id "/api/games/latest"
export const app = new Hono().post("/", async (c) => {
  startNewGameUseCase.run();
  return c.json({}, 201);
});
