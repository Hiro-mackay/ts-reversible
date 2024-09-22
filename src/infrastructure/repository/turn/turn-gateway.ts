import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { TurnRecord } from "./turn-record";
import { turns } from "../../../db/schema";
import { and, eq } from "drizzle-orm";

export class TurnGateway {
  async fondByTurnCount(
    db: NodePgDatabase,
    gameId: number,
    turnCount: number
  ): Promise<TurnRecord | undefined> {
    const result = await db
      .select()
      .from(turns)
      .where(and(eq(turns.gameId, gameId), eq(turns.turnCount, turnCount)));

    if (result.length === 0) {
      return undefined;
    }

    return new TurnRecord(
      result[0].id,
      result[0].gameId,
      result[0].turnCount,
      result[0].nextDisc ?? undefined,
      result[0].endedAt
    );
  }

  async insert(
    db: NodePgDatabase,
    gameId: number,
    turnCount: number,
    nextDisc: number | undefined,
    endedAt: Date
  ): Promise<TurnRecord> {
    const result = await db
      .insert(turns)
      .values({ gameId, turnCount, nextDisc, endedAt })
      .returning();

    const record = result[0];

    return new TurnRecord(
      record.id,
      record.gameId,
      record.turnCount,
      record.nextDisc ?? undefined,
      record.endedAt
    );
  }
}
