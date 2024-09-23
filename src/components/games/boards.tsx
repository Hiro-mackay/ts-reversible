import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appClient } from "../../utils/utils.client";
import { Disc } from "../../domain/model/turn/disc";
import { useMessageContext } from "../message/context";

type Props = {
  gameId: number;
  boards: Disc[][];
  nextDisc: Disc | undefined;
  turnCount: number;
  previewMode?: boolean;
};

export function Boards({
  gameId,
  boards,
  nextDisc,
  turnCount,
  previewMode = false,
}: Props) {
  return (
    <div>
      <div className="flex justify-center">
        <div className="flex flex-col border border-gray-300">
          {boards.map((horizontal, y) => (
            <div key={y} className="flex">
              {horizontal.map((discStatus, x) => (
                <Cell
                  key={x}
                  gameId={gameId}
                  discStatus={discStatus}
                  x={x}
                  y={y}
                  turnCount={turnCount}
                  turnDisc={nextDisc || 0}
                  previewMode={previewMode}
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
  gameId: number;
  discStatus: number;
  x: number;
  y: number;
  turnCount: number;
  turnDisc: number;
  previewMode: boolean;
};

function Cell(props: CellProps) {
  const queryClient = useQueryClient();
  const { setMessage } = useMessageContext();
  const mutations = useMutation({
    mutationKey: ["games", "latest", "turns"],
    mutationFn: async () => {
      if (props.discStatus !== Disc.Empty) {
        console.log("すでに石が置かれています");
        return null;
      }

      return await appClient.api.games[":gameId"].turns
        .$post({
          param: { gameId: `${props.gameId}` },
          json: {
            turnCount: props.turnCount + 1,
            move: { x: props.x, y: props.y, disc: props.turnDisc },
          },
        })
        .then(async (res) => {
          if (!res.ok) {
            const data = (await res.json()) as any;

            if (data?.error) {
              setMessage({
                type: data.error.type,
                text: data.error.message,
              });
            }
          }
        });
    },
    onSuccess(res) {
      queryClient.invalidateQueries({
        queryKey: ["games"],
      });
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
