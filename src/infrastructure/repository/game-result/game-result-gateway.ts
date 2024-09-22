import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { gameResults, games } from "../db/schema";
import { eq } from "drizzle-orm";
import { GameResultRecord } from "./game-result-record";

export class GameResultGateway {
  async findByGameId(
    db: NodePgDatabase,
    gameId: number
  ): Promise<GameResultRecord | undefined> {
    const gameResult = await db
      .select()
      .from(gameResults)
      .where(eq(gameResults.gameId, gameId));

    if (gameResult.length === 0) {
      return undefined;
    }

    return new GameResultRecord(
      gameResult[0].id,
      gameResult[0].gameId,
      gameResult[0].winner,
      gameResult[0].endedAt
    );
  }

  async insert(
    db: NodePgDatabase,
    gameId: number,
    winner: number,
    endedAt: Date
  ): Promise<void> {
    await db.insert(gameResults).values({
      gameId,
      winner,
      endedAt,
    });
  }
}
