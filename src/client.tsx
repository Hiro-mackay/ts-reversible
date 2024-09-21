import { createRoot } from "react-dom/client";
import { Layout } from "./components/layouts/main";
import { Header } from "./components/layouts/header";
import { Body } from "./components/layouts/body";
import { GameMessage } from "./components/games/game-message";
import { Boards } from "./components/games/boards";
import { TurnMessage } from "./components/games/turn-message";

function App() {
  return (
    <Layout>
      <Header />
      <Body>
        <GameMessage message="" />
        <Boards />
        <TurnMessage message="" />
      </Body>
    </Layout>
  );
}

const domNode = document.getElementById("root")!;
const root = createRoot(domNode);
root.render(<App />);
