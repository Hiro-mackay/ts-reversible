import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Turn } from "./turn";
import { TurnGateway } from "../../../infrastructure/turn-gateway";
import { SquareGateway } from "../../../infrastructure/square-gateway";
import { Disc, toDisc } from "./disc";
import { MoveGateway } from "../../../infrastructure/move-gateway";
import { Move } from "./move";
import { Point } from "./point";
import { Board } from "./board";
import { DomainError } from "../../error/domain-error";

const turnGateway = new TurnGateway();
const squareGateway = new SquareGateway();
const moveGateway = new MoveGateway();

export class TurnRepository {
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
