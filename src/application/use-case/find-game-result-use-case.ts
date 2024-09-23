import { db } from "../../db";
import {
  FindGameResultsQueryModel,
  FindGameResultsQueryService,
} from "../query/find-game-result-query-service";

export class FindGameResultsUseCase {
  constructor(private queryService: FindGameResultsQueryService) {}

  async run(limit: number): Promise<FindGameResultsQueryModel[]> {
    return this.queryService.query(db, limit);
  }
}
