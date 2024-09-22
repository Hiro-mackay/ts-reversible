import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { GameResult } from "./game-result";
import { GameResultGateway } from "../../../infrastructure/game-result-gateway";
import { toWinnerDisc } from "./winner-disc";

const gameREsultGateway = new GameResultGateway();

export class GameResultRepository {
  async findByGameId(
    db: NodePgDatabase,
    gameId: number
  ): Promise<GameResult | undefined> {
    const gameResultRecord = await gameREsultGateway.findByGameId(db, gameId);

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
    await gameREsultGateway.insert(
      db,
      gameResult.gameId,
      gameResult.winner,
      gameResult.endedAt
    );
  }
}
