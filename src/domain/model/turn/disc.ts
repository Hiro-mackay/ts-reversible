import { DomainError } from "../../error/domain-error";

export const Disc = {
  Empty: 0,
  Black: 1,
  White: 2,
  Wall: 3,
} as const;

export type Disc = (typeof Disc)[keyof typeof Disc];

export function toDisc(value: number): Disc {
  switch (value) {
    case Disc.Empty:
    case Disc.Black:
    case Disc.White:
      return value;
    default:
      throw new DomainError("InvalidDiscValue", `Invalid disc: ${value}`);
  }
}

export function isOppositeDisc(disc1: Disc, disc2: Disc): boolean {
  return disc2 !== Disc.Empty && disc1 !== disc2 && disc2 !== Disc.Wall;
}
