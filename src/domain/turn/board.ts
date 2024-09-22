import { Disc } from "./disc";
import { Move } from "./move";

export class Board {
  constructor(readonly discs: Disc[][]) {}

  place(move: Move): Board {
    const newDisc = structuredClone(this.discs);

    newDisc[move.point.y][move.point.x] = move.disc;

    return new Board(newDisc);
  }

  static init(): Board {
    const EMPTY = Disc.Empty;
    const BLACK = Disc.Black;
    const WHITE = Disc.White;

    const INITIAL_BOARD: Disc[][] = [
      [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
      [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
      [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
      [EMPTY, EMPTY, EMPTY, WHITE, BLACK, EMPTY, EMPTY, EMPTY],
      [EMPTY, EMPTY, EMPTY, BLACK, WHITE, EMPTY, EMPTY, EMPTY],
      [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
      [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
      [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
    ];

    return new Board(INITIAL_BOARD);
  }
}
