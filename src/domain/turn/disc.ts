export const Disc = {
  Empty: 0,
  Black: 1,
  White: 2,
} as const;

export type Disc = (typeof Disc)[keyof typeof Disc];

export function toDisc(value: number): Disc {
  switch (value) {
    case Disc.Empty:
    case Disc.Black:
    case Disc.White:
      return value;
    default:
      throw new Error(`Invalid disc: ${value}`);
  }
}
