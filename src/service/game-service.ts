import { db } from "../db";
import { TurnRepository } from "../domain/turn/turn-repository";
import { Turn } from "../domain/turn/turn";
import { GameRepository } from "../domain/game/game-repository";
import { Game } from "../domain/game/game";

const gameRepository = new GameRepository();
const turnRepository = new TurnRepository();

export class GameService {
  async startGame() {
    const now = new Date();

    const game = await gameRepository.save(db, new Game(undefined, now));

    if (!game.id) {
      throw new Error("Failed to start game");
    }

    const initTurn = Turn.init(game.id);

    await turnRepository.save(db, initTurn);
  }
}
