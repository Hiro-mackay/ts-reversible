import { useParams, useSearchParams } from "react-router-dom";
import { Boards } from "./boards";
import { GameMessage } from "./game-message";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { appClient, convertToDiscLabel } from "../../utils/utils.client";
import { useMessageContext } from "../message/context";
import { useEffect } from "react";

export function GamePreview() {
  const { gameId } = useParams();
  const [searchParams, setSearchParam] = useSearchParams();
  const { setMessage } = useMessageContext();

  const previewTurn = searchParams.get("turn");

  if (!gameId || Number.isNaN(Number(gameId))) {
    throw new Error("Invalid game ID ");
  }

  const query = useQuery({
    queryKey: ["games", gameId, "turns"],
    queryFn: async () => {
      const res = await fetchTurn(gameId, previewTurn);

      const responseData = await res.json();

      if (!res.ok) {
        const data = responseData as any;

        if (data?.error) {
          throw data.error;
        }
      }

      if (
        previewTurn === null ||
        responseData.turnCount !== Number(previewTurn)
      ) {
        searchParams.set("turn", responseData.turnCount.toString());
        setSearchParam(searchParams);
      }

      return responseData;
    },
  });

  useEffect(() => {
    if (
      query.data !== undefined &&
      query.data.turnCount !== Number(previewTurn)
    ) {
      query.refetch();
    }
  }, [previewTurn]);

  const applicationError = (query.data as any)?.error
    ? ((query.data as any).error as {
        type: string;
        message: string;
      })
    : undefined;

  if (query.isLoading) {
    return <div>読み込み中</div>;
  }

  if (query.failureReason) {
    const error = query.failureReason as any;

    if (error?.type && error?.message) {
      if (applicationError?.type === "ValidationError") {
        throw error;
      }

      if (applicationError?.type === "InternalServerError") {
        throw error;
      }

      setMessage(error);
    } else {
      throw error;
    }
  }

  if (query.data === undefined) {
    return <div>ゲームがありません</div>;
  }

  return (
    <div className="py-5">
      <div>
        <h1 className="text-lg text-center font-semibold p-1 bg-blue-100  w-96 rounded-sm text-slate-700 mx-auto mb-2">
          Preview Mode
        </h1>
      </div>
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
        previewMode
      />
      <div className="flex gap-2 w-96 mx-auto mt-3">
        <PrevTurnButton />
        <NextTurnButton isLatest={query.data.isLatest} />
      </div>
    </div>
  );
}

function NextTurnButton({ isLatest }: { isLatest: boolean }) {
  const [searchParams, setSearchParam] = useSearchParams();

  function onNext() {
    const turn = searchParams.get("turn");
    if (turn === null || Number.isNaN(Number(turn))) {
      return;
    } else {
      searchParams.set("turn", (Number(turn) + 1).toString());
      setSearchParam(searchParams);
    }
  }

  return (
    <button
      className={`py-2 px-4 text-sm bg-blue-500 text-white rounded-md  ${
        isLatest ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-400"
      }`}
      onClick={onNext}
      disabled={isLatest}
    >
      Next
    </button>
  );
}

function PrevTurnButton() {
  const [searchParams, setSearchParam] = useSearchParams();

  const turn = searchParams.get("turn");

  function onPrev() {
    if (turn === null || Number.isNaN(Number(turn))) {
      return;
    } else {
      searchParams.set("turn", (Number(turn) - 1).toString());
      setSearchParam(searchParams);
    }
  }

  return (
    <button
      className={`py-2 px-4 text-sm bg-blue-500 text-white rounded-md 
        ${
          Number(turn) <= 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-400"
        }
        `}
      onClick={onPrev}
      disabled={Number(turn) <= 1}
    >
      Prev
    </button>
  );
}

function fetchTurn(gameId: string, turnCount: string | null) {
  // turnCountがNullか、数値でない場合は最新のターンを取得
  if (turnCount === null || Number.isNaN(Number(turnCount))) {
    return appClient.api.games[":gameId"].turns.latest.$get({
      param: {
        gameId,
      },
    });
  } else {
    return appClient.api.games[":gameId"].turns[":turnCount"].$get({
      param: {
        gameId,
        turnCount,
      },
    });
  }
}
