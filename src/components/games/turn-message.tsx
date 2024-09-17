export function TurnMessage({ message }: { message: string }) {
  return message ? (
    <div
      className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 "
      role="alert"
    >
      {message}
    </div>
  ) : (
    <></>
  );
}
