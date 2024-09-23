import { useEffect } from "react";
import { WinnerDisc } from "../../domain/model/game-result/winner-disc";
import { Disc } from "../../domain/model/turn/disc";
import { convertToDiscLabel } from "../../utils/utils.client";
import { useMessageContext } from "../message/context";

type Props = {
  gameId: number;
  boards: Disc[][];
  nextDisc: Disc | undefined;
  turnCount: number;
  winnerDisc: WinnerDisc | undefined;
  previewMode?: boolean;
};

export function GameMessage({
  gameId,
  nextDisc,
  turnCount,
  winnerDisc,
}: Props) {
  const { message, setMessage } = useMessageContext();

  useEffect(() => {
    if (winnerDisc !== undefined && message?.type !== "GameEnded") {
      setMessage({
        type: "GameEnded",
        text: `GameEnded! Winner: ${convertToDiscLabel(winnerDisc)}`,
      });
    }
  }, [winnerDisc, message]);

  return (
    <div className="bg-slate-50 px-5 py-3 mb-5 text-xs w-96 mx-auto space-y-1 rounded-sm">
      <p>GameId: {gameId}</p>
      <p>Next Disc: {convertToDiscLabel(nextDisc)}</p>
      <p>Turn Count: {turnCount}</p>
      <p>Message: {message?.text}</p>
    </div>
  );
}
