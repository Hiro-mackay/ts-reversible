import { Disc } from "../domain/model/turn/disc";

export class SquareRecord {
  constructor(
    readonly id: number,
    readonly turnId: number,
    readonly x: number,
    readonly y: number,
    readonly disc: Disc
  ) {}
}
