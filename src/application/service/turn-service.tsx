import { db } from "../../db";
import { Point } from "../../domain/model/turn/point";
import { TurnRepository } from "../../domain/model/turn/turn-repository";
import { Disc, toDisc } from "../../domain/model/turn/disc";
import { GameRepository } from "../../domain/model/game/game-repository";
import { ApplicationError } from "./error/application-error";
import { GameResultRepository } from "../../domain/model/game-result/game-result-repository";
import { GameResult } from "../../domain/model/game-result/game-result";

const turnRepository = new TurnRepository();
const gameRepository = new GameRepository();
const gameResultRepository = new GameResultRepository();

export class TurnService {
  async findLatestTurn(turnCount: number) {
    const game = await gameRepository.findLatest(db);

    if (!game?.id) {
      throw new ApplicationError("LatestGameNotFound", "Latest game not found");
    }
    const turn = await turnRepository.findByTurnCount(db, game.id, turnCount);

    const gameResult = turn.gameEnded()
      ? await gameResultRepository.findByGameId(db, game.id)
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
    const game = await gameRepository.findLatest(db);

    if (!game?.id) {
      throw new ApplicationError("LatestGameNotFound", "Latest game not found");
    }

    const previousTurn = await turnRepository.findByTurnCount(
      db,
      game.id,
      previousTurnCount
    );

    const newTurn = previousTurn.placeNext(disc, point);

    turnRepository.save(db, newTurn);

    if (newTurn.gameEnded()) {
      const winnerDisc = newTurn.winnerDisc();
      const gameResult = new GameResult(game.id, winnerDisc, newTurn.endedAt);

      await gameResultRepository.save(db, gameResult);
    }
  }
}
