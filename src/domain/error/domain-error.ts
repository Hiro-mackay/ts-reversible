type DomainErrorType =
  | "SelectedPointNotEmpty"
  | "FlipPointsIsEmpty"
  | "SelectedDiscIsNotNextDisc"
  | "PreviousDiscIsNotOpponentDisc"
  | "SpecifiedTurnNotFound"
  | "PointOutOfRange"
  | "InvalidDiscValue";

export class DomainError extends Error {
  constructor(readonly type: DomainErrorType, message: string) {
    super(message);
  }
}
