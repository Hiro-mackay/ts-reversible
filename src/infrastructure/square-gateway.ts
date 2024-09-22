import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { SquareRecord } from "./square-record";
import { squares } from "../db/schema";
import { eq } from "drizzle-orm";
import { Disc, toDisc } from "../domain/model/turn/disc";

export class SquareGateway {
  async findByTurnId(
    db: NodePgDatabase,
    turnId: number
  ): Promise<SquareRecord[]> {
    const result = await db
      .select()
      .from(squares)
      .where(eq(squares.turnId, turnId));

    return result.map(
      (record) =>
        new SquareRecord(
          record.id,
          record.turnId,
          record.x,
          record.y,
          toDisc(record.disc)
        )
    );
  }

  async insertAll(
    db: NodePgDatabase,
    turnId: number,
    board: number[][]
  ): Promise<SquareRecord[]> {
    const squaresData: {
      turnId: number;
      x: number;
      y: number;
      disc: number;
    }[] = board.flatMap((line, y) =>
      line.map((disc, x) => ({ turnId: turnId, x, y, disc }))
    );

    const result = await db.insert(squares).values(squaresData).returning();

    return result.map(
      (record) =>
        new SquareRecord(
          record.id,
          record.turnId,
          record.x,
          record.y,
          toDisc(record.disc)
        )
    );
  }
}
