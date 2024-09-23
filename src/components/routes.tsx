import {
  BrowserRouter,
  Route,
  Routes as BrowserRoutes,
  createBrowserRouter,
} from "react-router-dom";
import { Layout } from "./layouts/main";
import { WelcomePage } from "./games/welcome";
import { GameMain } from "./games/game-main";
import { ErrorBoundary } from "./error";
import { GamePreview } from "./games/game-preview";

function Routes() {
  return (
    <BrowserRoutes>
      <Route index element={<WelcomePage />} errorElement={<ErrorBoundary />} />
      <Route
        path="/games/:gameId/play"
        element={<GameMain />}
        errorElement={<ErrorBoundary />}
      />
      <Route
        path="/games/:gameId/preview"
        element={<GamePreview />}
        errorElement={<ErrorBoundary />}
      />
    </BrowserRoutes>
  );
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "*",
        element: <Routes />,
        errorElement: <ErrorBoundary />,
      },
    ],
  },
]);
