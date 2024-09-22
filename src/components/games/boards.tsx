import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appClient } from "../../utils/utils.client";
import { Disc } from "../../domain/turn/disc";

export function Boards() {
  // const [board, setBoard] = useState(INITIAL_BOARD);
  const [turnCount, setTurnCount] = useState(0);
  // const [turnDisc, setTurnDisc] = useState(EMPTY);

  const query = useQuery({
    queryKey: ["games", "latest", "turns"],
    queryFn: async () => {
      const res = await appClient.api.games.latest.turns[":turnCount"].$get({
        param: { turnCount: `${turnCount}` },
      });

      return await res.json();
    },
  });

  if (query.isLoading) {
    return <div>読み込み中</div>;
  }

  if (query.error) {
    console.error(query.error);
    return <div>エラーが発生しました</div>;
  }

  if (query.data === undefined) {
    return <div>ゲームがありません</div>;
  }

  return (
    <div>
      <div className="flex justify-center">
        <div className="flex flex-col border border-gray-300">
          {query.data.board.map((horizontal, y) => (
            <div key={y} className="flex">
              {horizontal.map((discStatus, x) => (
                <Cell
                  key={x}
                  discStatus={discStatus}
                  x={x}
                  y={y}
                  turnCount={turnCount}
                  turnDisc={query.data.nextDisc || 0}
                  setTurnCount={setTurnCount}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type CellProps = {
  discStatus: number;
  x: number;
  y: number;
  turnCount: number;
  turnDisc: number;
  setTurnCount: (turnCount: number) => void;
};

function Cell(props: CellProps) {
  const queryClient = useQueryClient();
  const mutations = useMutation({
    mutationKey: ["games", "latest", "turns"],
    mutationFn: async () => {
      if (props.discStatus !== Disc.Empty) {
        console.log("すでに石が置かれています");
        return null;
      }

      return await appClient.api.games.latest.turns.index.$post({
        json: {
          turnCount: props.turnCount + 1,
          x: props.x,
          y: props.y,
          disc: props.turnDisc,
        },
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["games", "latest", "turns"],
      });
      props.setTurnCount(props.turnCount + 1);
    },
  });

  return (
    <div
      className="w-10 h-10 border border-gray-300 flex justify-center items-center"
      onClick={() => mutations.mutate()}
    >
      <Stone {...props} />
    </div>
  );
}

function Stone({ discStatus }: CellProps) {
  switch (discStatus) {
    case Disc.Empty:
      return <></>;

    case Disc.Black:
      return (
        <div className="w-8 h-8 rounded-full border border-gray-500 bg-black" />
      );

    case Disc.White:
      return (
        <div className="w-8 h-8 rounded-full border border-gray-500 bg-white" />
      );

    default:
      return <></>;
  }
}
