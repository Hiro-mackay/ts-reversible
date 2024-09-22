import { Disc } from "./disc";
import { Point } from "./point";

export class Move {
  constructor(readonly disc: Disc, readonly point: Point) {}
}
