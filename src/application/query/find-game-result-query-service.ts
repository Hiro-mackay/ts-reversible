import { NodePgDatabase } from "drizzle-orm/node-postgres";

export class FindGameResultsQueryModel {
  constructor(
    readonly gameId: number,
    readonly blackMoveCount: number,
    readonly whiteMoveCount: number,
    readonly winnerDisc: number,
    readonly startedAt: Date,
    readonly endedAt: Date
  ) {}
}

export interface FindGameResultsQueryService {
  query(
    db: NodePgDatabase,
    limit: number
  ): Promise<FindGameResultsQueryModel[]>;
}
