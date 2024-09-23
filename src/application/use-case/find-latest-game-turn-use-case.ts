import { db } from "../../db";
import { ApplicationError } from "../error/application-error";
import { GameRepository } from "../../domain/model/game/game-repository";
import { TurnRepository } from "../../domain/model/turn/turn-repository";
import { GameResultRepository } from "../../domain/model/game-result/game-result-repository";

export class FindLatestGameTurnUseCase {
  constructor(
    private gameRepository: GameRepository,
    private turnRepository: TurnRepository,
    private gameResultRepository: GameResultRepository
  ) {}

  async run(gameId: number) {
    const game = await this.gameRepository.findById(db, gameId);

    if (!game?.id) {
      throw new ApplicationError("LatestGameNotFound", "Latest game not found");
    }
    const turn = await this.turnRepository.findLatestByGameId(db, game.id);

    const gameResult = turn.gameEnded()
      ? await this.gameResultRepository.findByGameId(db, game.id)
      : undefined;

    return {
      gameId: game.id,
      turnCount: turn.turnCount,
      board: turn.board.discs,
      winnerDisc: gameResult?.winner,
      nextDisc: turn.nextDisc,
    };
  }
}
