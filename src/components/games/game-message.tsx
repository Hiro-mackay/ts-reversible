export function GameMessage({ message }: { message: string }) {
  return message ? (
    <div
      className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50"
      role="alert"
    >
      {message}
    </div>
  ) : (
    <></>
  );
}
