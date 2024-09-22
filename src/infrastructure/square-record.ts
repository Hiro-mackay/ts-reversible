import { Disc } from "../domain/turn/disc";

export class SquareRecord {
  constructor(
    readonly id: number,
    readonly turnId: number,
    readonly x: number,
    readonly y: number,
    readonly disc: Disc
  ) {}
}
