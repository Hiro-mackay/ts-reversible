import { useParams } from "react-router-dom";
import { Boards } from "./boards";
import { GameMessage } from "./game-message";
import { useQuery } from "@tanstack/react-query";
import { appClient, convertToDiscLabel } from "../../utils/utils.client";
import { useMessageContext } from "../message/context";

export function GameMain() {
  const { gameId } = useParams();
  const { setMessage } = useMessageContext();

  if (!gameId || Number.isNaN(Number(gameId))) {
    throw new Error("Invalid game ID or turn count");
  }

  const query = useQuery({
    queryKey: ["games", gameId, "turns"],
    queryFn: async () => {
      const res = await appClient.api.games[":gameId"].turns.latest.$get({
        param: {
          gameId,
        },
      });

      console.log({ res });

      const responseData = await res.json();

      if (!res.ok) {
        const data = responseData as any;
        if (data?.error) {
          setMessage({
            type: data.error.type,
            text: data.error.message,
          });
        }
      }

      return responseData;
    },
  });

  const applicationError = (query.data as any)?.error
    ? ((query.data as any).error as {
        type: string;
        message: string;
      })
    : undefined;

  if (query.isLoading) {
    return <div>読み込み中</div>;
  }

  if (query.error) {
    throw query.error;
  }

  if (applicationError?.type) {
    if (applicationError?.type === "ValidationError") {
      throw new Error(applicationError.message);
    }
    setMessage({
      type: applicationError.type,
      text: applicationError.message,
    });
  }

  if (query.data === undefined) {
    return <div>ゲームがありません</div>;
  }



  return (
    <>
      <GameMessage
        gameId={query.data.gameId}
        boards={query.data.board}
        nextDisc={query.data.nextDisc}
        turnCount={query.data.turnCount}
        winnerDisc={query.data.winnerDisc}
      />
      <Boards
        gameId={query.data.gameId}
        boards={query.data.board}
        nextDisc={query.data.nextDisc}
        turnCount={query.data.turnCount}
      />
    </>
  );
}
