import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { GameResult } from "./game-result";

export interface GameResultRepository {
  findByGameId(
    db: NodePgDatabase,
    gameId: number
  ): Promise<GameResult | undefined>;

  save(db: NodePgDatabase, gameResult: GameResult): Promise<void>;
}
