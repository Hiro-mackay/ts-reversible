import { db } from "../db";
import { Point } from "../domain/turn/point";
import { TurnRepository } from "../domain/turn/turn-repository";
import { toDisc } from "../domain/turn/disc";
import { GameRepository } from "../domain/game/game-repository";

const turnRepository = new TurnRepository();
const gameRepository = new GameRepository();

export class TurnService {
  async findLatestTurn(turnCount: number) {
    const game = await gameRepository.findLatest(db);

    if (!game?.id) {
      throw new Error("Latest game not found");
    }

    const turn = await turnRepository.findByTurnCount(db, game.id, turnCount);

    return {
      turnCount,
      board: turn.board.discs,
      winner: null,
      nextDisc: turn.nextDisc,
    };
  }

  async registerTurn(turnCount: number, disc: number, x: number, y: number) {
    const previousTurnCount = turnCount - 1;

    // 前の盤面を取得
    const game = await gameRepository.findLatest(db);

    if (!game?.id) {
      throw new Error("Latest game not found");
    }

    const previousTurn = await turnRepository.findByTurnCount(
      db,
      game.id,
      previousTurnCount
    );

    const newTurn = previousTurn.placeNext(toDisc(disc), new Point(x, y));

    turnRepository.save(db, newTurn);
  }
}
