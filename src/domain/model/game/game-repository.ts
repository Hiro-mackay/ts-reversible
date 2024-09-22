import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Game } from "./game";
import { GameGateway } from "../../../infrastructure/game-gateway";

const gameGateway = new GameGateway();

export class GameRepository {
  async findLatest(db: NodePgDatabase): Promise<Game | undefined> {
    const gameRecord = await gameGateway.findLatest(db);

    if (!gameRecord) {
      return undefined;
    }

    return new Game(gameRecord.id, gameRecord.startedAt);
  }

  async save(db: NodePgDatabase, game: Game): Promise<Game> {
    const gameRecord = await gameGateway.insert(db, game.startedAt);

    return new Game(gameRecord.id, gameRecord.startedAt);
  }
}
