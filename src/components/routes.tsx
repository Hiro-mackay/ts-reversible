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

function Routes() {
  return (
    <BrowserRoutes>
      <Route index element={<WelcomePage />} errorElement={<ErrorBoundary />} />
      <Route
        path="/games/:gameId/play"
        element={<GameMain />}
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
