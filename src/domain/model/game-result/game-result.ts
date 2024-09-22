import { WinnerDisc } from "./winner-disc";

export class GameResult {
  constructor(
    readonly gameId: number,
    readonly winner: WinnerDisc,
    readonly endedAt: Date
  ) {}
}
