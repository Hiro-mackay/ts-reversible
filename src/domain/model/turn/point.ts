import { DomainError } from "../../error/domain-error";

const MIN_POINT = 0;
const MAX_POINT = 7;

export class Point {
  constructor(readonly x: number, readonly y: number) {
    if (x < MIN_POINT || x > MAX_POINT || y < MIN_POINT || y > MAX_POINT) {
      throw new DomainError("PointOutOfRange", "Point is out of range");
    }
  }
}
