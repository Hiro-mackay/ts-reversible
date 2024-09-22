import { Hono } from "hono";
import { GameService } from "../application/service/game-service";

const gameService = new GameService();

// base path id "/api/games/latest"
export const app = new Hono().post("/", async (c) => {
  gameService.startGame();
  return c.json({}, 201);
});
