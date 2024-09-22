export const WinnerDisc = {
  DRAW: 0,
  Black: 1,
  White: 2,
} as const;

export type WinnerDisc = (typeof WinnerDisc)[keyof typeof WinnerDisc];

export function toWinnerDisc(value: number): WinnerDisc {
  switch (value) {
    case WinnerDisc.DRAW:
    case WinnerDisc.Black:
    case WinnerDisc.White:
      return value;
    default:
      throw new Error(`Invalid winner disc: ${value}`);
  }
}
