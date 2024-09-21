import { createRoot } from "react-dom/client";
import { Layout } from "./components/layouts/main";
import { Header } from "./components/layouts/header";
import { Body } from "./components/layouts/body";
import { GameMessage } from "./components/games/game-message";
import { Boards } from "./components/games/boards";
import { TurnMessage } from "./components/games/turn-message";

function App() {
  const fetchAPI = async () => {
    try {
      const response = await fetch("/api/games", { method: "POST" });

      if (response.status === 201) {
        console.log("Game created");
      } else {
        console.error("Error creating game");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <Header />
      <Body>
        <GameMessage message="" />
        <Boards />
        <TurnMessage message="" />
        <button onClick={fetchAPI}>Create Game</button>
      </Body>
    </Layout>
  );
}

const domNode = document.getElementById("root")!;
const root = createRoot(domNode);
root.render(<App />);
