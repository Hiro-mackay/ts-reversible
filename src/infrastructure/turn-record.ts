export class TurnRecord {
  constructor(
    readonly id: number,
    readonly gameId: number,
    readonly turnCount: number,
    readonly nextDisc: number,
    readonly endedAt: Date
  ) {}
}
