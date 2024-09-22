import { DomainError } from "../../error/domain-error";
import { WinnerDisc } from "../game-result/winner-disc";
import { Board } from "./board";
import { Disc } from "./disc";
import { Move } from "./move";
import { Point } from "./point";

export class Turn {
  constructor(
    readonly gameId: number,
    readonly turnCount: number,
    readonly nextDisc: Disc | undefined,
    readonly move: Move | undefined,
    readonly board: Board,
    readonly endedAt: Date
  ) {}

  placeNext(disc: Disc, point: Point): Turn {
    if (disc !== this.nextDisc) {
      throw new DomainError(
        "SelectedDiscIsNotNextDisc",
        "Selected disc is not next disc"
      );
    }

    const move = new Move(disc, point);

    const nextBoard = this.board.place(move);

    const nextDisc = this.decideNextDisc(nextBoard, disc);

    return new Turn(
      this.gameId,
      this.turnCount + 1,
      nextDisc,
      move,
      nextBoard,
      new Date()
    );
  }

  gameEnded(): boolean {
    return this.nextDisc === undefined;
  }

  winnerDisc(): WinnerDisc {
    const blackCount = this.board.countDisc(Disc.Black);
    const whiteCount = this.board.countDisc(Disc.White);

    if (blackCount > whiteCount) {
      return WinnerDisc.Black;
    } else if (blackCount < whiteCount) {
      return WinnerDisc.White;
    } else {
      return WinnerDisc.DRAW;
    }
  }

  private decideNextDisc(board: Board, previousDisc: Disc): Disc | undefined {
    const existsBlackValidMove = board.existsValidMove(Disc.Black);
    const existsWhiteValidMove = board.existsValidMove(Disc.White);

    if (existsBlackValidMove && existsWhiteValidMove) {
      return previousDisc === Disc.Black ? Disc.White : Disc.Black;
    } else if (existsBlackValidMove) {
      return Disc.Black;
    } else if (existsWhiteValidMove) {
      return Disc.White;
    } else return undefined;
  }

  static init(gameId: number): Turn {
    return new Turn(gameId, 1, Disc.Black, undefined, Board.init(), new Date());
  }
}
