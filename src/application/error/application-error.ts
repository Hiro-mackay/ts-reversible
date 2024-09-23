type ApplicationErrorType =
  | "LatestGameNotFound"
  | "SpecifiedGameNotFound"
  | "GameAlreadyEnded";

export class ApplicationError extends Error {
  constructor(readonly type: ApplicationErrorType, message: string) {
    super(message);
  }
}
