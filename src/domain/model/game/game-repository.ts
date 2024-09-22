import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Game } from "./game";
import { GameGateway } from "../../../infrastructure/repository/game/game-gateway";

const gameGateway = new GameGateway();

export interface GameRepository {
  findLatest(db: NodePgDatabase): Promise<Game | undefined>;
  save(db: NodePgDatabase, game: Game): Promise<Game>;
}
