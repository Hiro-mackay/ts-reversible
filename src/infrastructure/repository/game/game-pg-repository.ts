import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { GameGateway } from "./game-gateway";
import { Game } from "../../../domain/model/game/game";
import { GameRepository } from "../../../domain/model/game/game-repository";

const gameGateway = new GameGateway();

export class GamePgRepository implements GameRepository {
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
