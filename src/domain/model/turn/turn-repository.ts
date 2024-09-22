import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Turn } from "./turn";

export interface TurnRepository {
  findByTurnCount(
    db: NodePgDatabase,
    gameId: number,
    turnCount: number
  ): Promise<Turn>;

  save(db: NodePgDatabase, turn: Turn): Promise<void>;
}
