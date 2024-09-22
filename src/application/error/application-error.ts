type ApplicationErrorType = "LatestGameNotFound" | "SpecifiedGameNotFound";

export class ApplicationError extends Error {
  constructor(readonly type: ApplicationErrorType, message: string) {
    super(message);
  }
}
