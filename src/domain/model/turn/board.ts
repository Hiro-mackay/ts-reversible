import { DomainError } from "../../error/domain-error";
import { Disc, isOppositeDisc } from "./disc";
import { Move } from "./move";
import { Point } from "./point";

export class Board {
  private wallDisc: Disc[][];

  constructor(readonly discs: Disc[][]) {
    this.wallDisc = this.initWallDisc();
  }

  place(move: Move): Board {
    if (this.discs[move.point.y][move.point.x] !== Disc.Empty) {
      throw new DomainError(
        "SelectedPointNotEmpty",
        "Selected point is not empty"
      );
    }

    const flipPoints = this.flipPoints(move);

    if (flipPoints.length === 0) {
      throw new DomainError("FlipPointsIsEmpty", "Flip points is empty");
    }

    const newDisc = structuredClone(this.discs);

    newDisc[move.point.y][move.point.x] = move.disc;

    flipPoints.forEach((point) => {
      newDisc[point.y][point.x] = move.disc;
    });

    return new Board(newDisc);
  }

  private flipPoints(move: Move): Point[] {
    const flipPoints: Point[] = [];

    const walledX = move.point.x + 1;
    const walledY = move.point.y + 1;

    const flipChecks = (moveX: number, moveY: number) => {
      const flipCandidates: Point[] = [];

      let cursorX = walledX + moveX;
      let cursorY = walledY + moveY;

      while (isOppositeDisc(move.disc, this.wallDisc[cursorY][cursorX])) {
        flipCandidates.push(new Point(cursorX - 1, cursorY - 1));

        cursorX += moveX;
        cursorY += moveY;

        if (this.wallDisc[cursorY][cursorX] === move.disc) {
          flipPoints.push(...flipCandidates);
          break;
        }
      }
    };

    // Top
    flipChecks(0, -1);
    // Top-right
    flipChecks(1, -1);
    // Right
    flipChecks(1, 0);
    // Bottom-right
    flipChecks(1, 1);
    // Bottom
    flipChecks(0, 1);
    // Bottom-left
    flipChecks(-1, 1);
    // Left
    flipChecks(-1, 0);
    // Top-left
    flipChecks(-1, -1);

    return flipPoints;
  }

  existsValidMove(disc: Disc): boolean {
    this.discs.forEach((line, y) => {
      line.forEach((cell, x) => {
        if (cell !== Disc.Empty) {
          return;
        }

        const move = new Move(disc, new Point(x, y));
        const flipPoints = this.flipPoints(move);

        if (flipPoints.length !== 0) {
          return true;
        }
      });
    });
    return false;
  }

  countDisc(disc: Disc): number {
    return this.discs.flat().filter((cell) => cell === disc).length;
  }

  private initWallDisc(): Disc[][] {
    const walledDisc: Disc[][] = [];
    const walledLine = Array(10).fill(Disc.Wall);
    walledDisc.push(walledLine);

    this.discs.forEach((line) => {
      walledDisc.push([Disc.Wall, ...line, Disc.Wall]);
    });

    walledDisc.push(walledLine);

    return walledDisc;
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
