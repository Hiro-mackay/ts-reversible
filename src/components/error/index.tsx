import { useRouteError } from "react-router-dom";

export function ErrorBoundary() {
  const error = useRouteError() as Error;

  console.error("ErrorBoundary catch error", error);

  // Uncaught ReferenceError: path is not defined
  return (
    <div className="text-red-500">
      <p className="font-semibold">Error</p>
      <pre>{error.message}</pre>
    </div>
  );
}
