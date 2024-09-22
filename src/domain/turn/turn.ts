import { Board } from "./board";
import { Disc } from "./disc";
import { Move } from "./move";
import { Point } from "./point";

export class Turn {
  constructor(
    readonly gameId: number,
    readonly turnCount: number,
    readonly nextDisc: Disc,
    readonly move: Move | undefined,
    readonly board: Board,
    readonly endedAt: Date
  ) {}

  placeNext(disc: Disc, point: Point): Turn {
    if (disc !== this.nextDisc) {
      throw new Error("Invalid disc");
    }

    const move = new Move(disc, point);

    const nextBoard = this.board.place(move);

    const nextDisc = disc === Disc.Black ? Disc.White : Disc.Black;

    return new Turn(
      this.gameId,
      this.turnCount + 1,
      nextDisc,
      move,
      nextBoard,
      new Date()
    );
  }

  static init(gameId: number): Turn {
    return new Turn(gameId, 1, Disc.Black, undefined, Board.init(), new Date());
  }
}
