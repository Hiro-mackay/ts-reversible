import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { MoveRecord } from "./move-record";
import { moves } from "../db/schema";

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
}
