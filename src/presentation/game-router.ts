import { Hono } from "hono";
import { GameService } from "../application/service/game-service";
import { GamePgRepository } from "../infrastructure/repository/game/game-pg-repository";
import { TurnPgRepository } from "../infrastructure/repository/turn/turn-pg-repository";

const gameService = new GameService(
  new GamePgRepository(),
  new TurnPgRepository()
);

// base path id "/api/games/latest"
export const app = new Hono().post("/", async (c) => {
  gameService.startGame();
  return c.json({}, 201);
});
