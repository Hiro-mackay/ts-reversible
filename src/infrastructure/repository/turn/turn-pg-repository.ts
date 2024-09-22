import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { TurnGateway } from "./turn-gateway";
import { SquareGateway } from "./square-gateway";
import { MoveGateway } from "./move-gateway";
import { Turn } from "../../../domain/model/turn/turn";
import { DomainError } from "../../../domain/error/domain-error";
import { Disc, toDisc } from "../../../domain/model/turn/disc";
import { Board } from "../../../domain/model/turn/board";
import { Move } from "../../../domain/model/turn/move";
import { Point } from "../../../domain/model/turn/point";
import { TurnRepository } from "../../../domain/model/turn/turn-repository";

const turnGateway = new TurnGateway();
const squareGateway = new SquareGateway();
const moveGateway = new MoveGateway();

export class TurnPgRepository implements TurnRepository {
  async findByTurnCount(
    db: NodePgDatabase,
    gameId: number,
    turnCount: number
  ): Promise<Turn> {
    const turnRecord = await turnGateway.fondByTurnCount(db, gameId, turnCount);

    if (!turnRecord) {
      throw new DomainError(
        "SpecifiedTurnNotFound",
        "Specified turn not found"
      );
    }

    const squareRecord = await squareGateway.findByTurnId(db, turnRecord.id);

    const board: Disc[][] = Board.init().discs.map((line, y) =>
      line.map((_, x) => Disc.Empty)
    );

    squareRecord.forEach((square) => {
      board[square.y][square.x] = square.disc;
    });

    const moveRecord = await moveGateway.findByTurnId(db, turnRecord.id);

    const move = moveRecord
      ? new Move(toDisc(moveRecord.disc), new Point(moveRecord.x, moveRecord.y))
      : undefined;

    const nextDisc = turnRecord.nextDisc
      ? toDisc(turnRecord.nextDisc)
      : undefined;

    return new Turn(
      gameId,
      turnCount,
      nextDisc,
      move,
      new Board(board),
      turnRecord.endedAt
    );
  }

  async save(db: NodePgDatabase, turn: Turn) {
    const turnRecord = await turnGateway.insert(
      db,
      turn.gameId,
      turn.turnCount,
      turn.nextDisc,
      turn.endedAt
    );

    await squareGateway.insertAll(db, turnRecord.id, turn.board.discs);

    if (turn.move) {
      await moveGateway.insert(
        db,
        turnRecord.id,
        turn.move.disc,
        turn.move.point.x,
        turn.move.point.y
      );
    }
  }
}
