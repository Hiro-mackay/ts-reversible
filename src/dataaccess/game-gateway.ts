import { desc } from "drizzle-orm";
import { db } from "../db";
import { games } from "../db/schema";
import { GameRecord } from "./game-record";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export class GameGateway {
  async findLatest(db: NodePgDatabase): Promise<GameRecord | undefined> {
    const gameResult = await db
      .select()
      .from(games)
      .orderBy(desc(games.id))
      .limit(1);

    if (gameResult.length === 0) {
      return undefined;
    }

    const game = gameResult[0];

    return new GameRecord(game.id, game.startedAt);
  }

  async insert(db: NodePgDatabase, startedAt: Date): Promise<GameRecord> {
    const gameResult = await db.insert(games).values({ startedAt }).returning();

    const game = gameResult[0];

    return new GameRecord(game.id, game.startedAt);
  }
}
