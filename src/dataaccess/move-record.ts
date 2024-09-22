export class MoveRecord {
  constructor(
    readonly id: number,
    readonly turnId: number,
    readonly disc: number,
    readonly x: number,
    readonly y: number
  ) {}
}
