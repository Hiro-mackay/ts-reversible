import { db } from "../../db";
import { Point } from "../../domain/model/turn/point";
import { Disc } from "../../domain/model/turn/disc";
import { ApplicationError } from "../error/application-error";
import { GameResult } from "../../domain/model/game-result/game-result";
import { GameRepository } from "../../domain/model/game/game-repository";
import { TurnRepository } from "../../domain/model/turn/turn-repository";
import { GameResultRepository } from "../../domain/model/game-result/game-result-repository";

export class RegisterTurnUseCase {
  constructor(
    private gameRepository: GameRepository,
    private turnRepository: TurnRepository,
    private gameResultRepository: GameResultRepository
  ) {}

  async run(gameId: number, turnCount: number, disc: Disc, point: Point) {
    const previousTurnCount = turnCount - 1;

    // ゲームが終了しているか
    const gameResult = await this.gameResultRepository.findByGameId(db, gameId);

    if (gameResult?.winner) {
      throw new ApplicationError("GameAlreadyEnded", "Game already ended");
    }

    // 前の盤面を取得
    const game = await this.gameRepository.findById(db, gameId);

    if (!game?.id) {
      throw new ApplicationError(
        "SpecifiedGameNotFound",
        "Specified game not found"
      );
    }

    const previousTurn = await this.turnRepository.findByTurnCount(
      db,
      game.id,
      previousTurnCount
    );

    const newTurn = previousTurn.placeNext(disc, point);

    this.turnRepository.save(db, newTurn);

    if (newTurn.gameEnded()) {
      const winnerDisc = newTurn.winnerDisc();
      const gameResult = new GameResult(game.id, winnerDisc, newTurn.endedAt);

      await this.gameResultRepository.save(db, gameResult);
    }
  }
}
