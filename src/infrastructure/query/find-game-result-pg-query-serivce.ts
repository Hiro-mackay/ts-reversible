import { NodePgDatabase } from "drizzle-orm/node-postgres";
import {
  FindGameResultsQueryModel,
  FindGameResultsQueryService,
} from "../../application/query/find-game-result-query-service";
import { gameResults, games, moves, turns } from "../../db/schema";
import { desc, eq, max, sql } from "drizzle-orm";

export class FindGameResultsPgQueryService
  implements FindGameResultsQueryService
{
  async query(
    db: NodePgDatabase,
    limit: number
  ): Promise<FindGameResultsQueryModel[]> {
    const result = await db
      .select({
        game_id: max(games.id).mapWith(games.id),
        black_move_count: sql<number>`SUM(CASE WHEN moves.disc = 1 THEN 1 ELSE 0 END)`,
        white_move_count: sql<number>`SUM(CASE WHEN moves.disc = 2 THEN 1 ELSE 0 END)`,
        winner_disc: max(gameResults.winner).mapWith(gameResults.winner),
        started_at: max(games.startedAt).mapWith(games.startedAt),
        ended_at: max(gameResults.endedAt).mapWith(gameResults.endedAt),
      })
      .from(games)
      .leftJoin(gameResults, eq(games.id, gameResults.gameId))
      .leftJoin(turns, eq(games.id, turns.gameId))
      .leftJoin(moves, eq(turns.id, moves.turnId))
      .groupBy(games.id)
      .orderBy(desc(games.id))
      .limit(limit);

    return result.map((r) => {
      return new FindGameResultsQueryModel(
        r.game_id,
        r.black_move_count,
        r.white_move_count,
        r.winner_disc,
        r.started_at,
        r.ended_at
      );
    });
  }
}
