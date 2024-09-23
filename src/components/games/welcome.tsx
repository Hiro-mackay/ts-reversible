import { GameHistory } from "./game-history";
import { StartNewGameButton } from "./start-game";

export function WelcomePage() {
  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-xl font-semibold">Welcome to Reversi</h1>
        <p>Click the button below to start a new game</p>
        <StartNewGameButton />
      </div>

      <div className="mt-10">
        <GameHistory />
      </div>
    </>
  );
}
