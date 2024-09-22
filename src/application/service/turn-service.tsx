import { db } from "../../db";
import { Point } from "../../domain/model/turn/point";
import { Disc } from "../../domain/model/turn/disc";
import { ApplicationError } from "./error/application-error";
import { GameResult } from "../../domain/model/game-result/game-result";
import { GameRepository } from "../../domain/model/game/game-repository";
import { TurnRepository } from "../../domain/model/turn/turn-repository";
import { GameResultRepository } from "../../domain/model/game-result/game-result-repository";

export class TurnService {
  constructor(
    private gameRepository: GameRepository,
    private turnRepository: TurnRepository,
    private gameResultRepository: GameResultRepository
  ) {}

  async findLatestTurn(turnCount: number) {
    const game = await this.gameRepository.findLatest(db);

    if (!game?.id) {
      throw new ApplicationError("LatestGameNotFound", "Latest game not found");
    }
    const turn = await this.turnRepository.findByTurnCount(
      db,
      game.id,
      turnCount
    );

    const gameResult = turn.gameEnded()
      ? await this.gameResultRepository.findByGameId(db, game.id)
      : undefined;

    return {
      turnCount,
      board: turn.board.discs,
      winnerDisc: gameResult?.winner,
      nextDisc: turn.nextDisc,
    };
  }

  async registerTurn(turnCount: number, disc: Disc, point: Point) {
    const previousTurnCount = turnCount - 1;

    // 前の盤面を取得
    const game = await this.gameRepository.findLatest(db);

    if (!game?.id) {
      throw new ApplicationError("LatestGameNotFound", "Latest game not found");
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
