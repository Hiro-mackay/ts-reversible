import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { moves } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { MoveRecord } from "./move-record";

export class MoveGateway {
  async insert(
    db: NodePgDatabase,
    turnId: number,
    disc: number,
    x: number,
    y: number
  ): Promise<MoveRecord> {
    const result = await db
      .insert(moves)
      .values({ turnId, disc, x, y })
      .returning();

    const record = result[0];

    return new MoveRecord(
      record.id,
      record.turnId,
      record.disc,
      record.x,
      record.y
    );
  }

  async findByTurnId(
    db: NodePgDatabase,
    turnId: number
  ): Promise<MoveRecord | undefined> {
    const result = await db
      .select()
      .from(moves)
      .where(eq(moves.turnId, turnId));

    if (result.length === 0) {
      return undefined;
    }

    return new MoveRecord(
      result[0].id,
      result[0].turnId,
      result[0].disc,
      result[0].x,
      result[0].y
    );
  }
}
