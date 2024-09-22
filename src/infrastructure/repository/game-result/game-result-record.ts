export class GameResultRecord {
  constructor(
    readonly id: number,
    readonly gameId: number,
    readonly winnerDisc: number,
    readonly endedAt: Date
  ) {}
}
