import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { GameResult } from "../../../domain/model/game-result/game-result";
import { GameResultGateway } from "./game-result-gateway";
import { toWinnerDisc } from "../../../domain/model/game-result/winner-disc";
import { GameResultRepository } from "../../../domain/model/game-result/game-result-repository";

const gameResultGateway = new GameResultGateway();

export class GameResultPgRepository implements GameResultRepository {
  async findByGameId(
    db: NodePgDatabase,
    gameId: number
  ): Promise<GameResult | undefined> {
    const gameResultRecord = await gameResultGateway.findByGameId(db, gameId);

    if (!gameResultRecord) {
      return undefined;
    }

    return new GameResult(
      gameResultRecord.gameId,
      toWinnerDisc(gameResultRecord.winnerDisc),
      gameResultRecord.endedAt
    );
  }

  async save(db: NodePgDatabase, gameResult: GameResult): Promise<void> {
    await gameResultGateway.insert(
      db,
      gameResult.gameId,
      gameResult.winner,
      gameResult.endedAt
    );
  }
}
