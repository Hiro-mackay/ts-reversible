import { db } from "../../db";
import { Turn } from "../../domain/model/turn/turn";
import { Game } from "../../domain/model/game/game";
import { GameRepository } from "../../domain/model/game/game-repository";
import { TurnRepository } from "../../domain/model/turn/turn-repository";

export class StartNewGameUseCase {
  constructor(
    private gameRepository: GameRepository,
    private turnRepository: TurnRepository
  ) {}

  async run() {
    const now = new Date();

    const game = await this.gameRepository.save(db, new Game(undefined, now));

    if (!game.id) {
      throw new Error("Failed to start game");
    }

    const initTurn = Turn.init(game.id);

    await this.turnRepository.save(db, initTurn);

    return game;
  }
}
