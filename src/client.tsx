import { createRoot } from "react-dom/client";
import { Layout } from "./components/layouts/main";
import { Header } from "./components/layouts/header";
import { Body } from "./components/layouts/body";
import { GameMessage } from "./components/games/game-message";
import { Boards } from "./components/games/boards";
import { TurnMessage } from "./components/games/turn-message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { hc } from "hono/client";
import { AppType } from ".";

const queryClient = new QueryClient();
export const appClient = hc<AppType>("/", {
  headers: { "Content-Type": "application/json" },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Header />
        <Body>
          <GameMessage message="" />
          <Boards />
          <TurnMessage message="" />
        </Body>
      </Layout>
    </QueryClientProvider>
  );
}

const domNode = document.getElementById("root")!;
const root = createRoot(domNode);
root.render(<App />);
