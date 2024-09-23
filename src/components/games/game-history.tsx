import { useQuery } from "@tanstack/react-query";
import { appClient, convertToDiscLabel } from "../../utils/utils.client";
import { XataHttpDriver } from "drizzle-orm/xata-http";
import { useMessageContext } from "../message/context";
import { Link } from "react-router-dom";

type Props = {
  limit?: number;
};

export function GameHistory({ limit }: Props) {
  const { setMessage } = useMessageContext();
  const query = useQuery({
    queryKey: ["games", "history"],
    queryFn: async () => {
      const res = await appClient.api.result.games.$get({
        query: {
          limit: limit ? `${limit}` : undefined,
        },
      });

      if (!res.ok) {
        const data = (await res.json()) as any;
        if (data?.error) {
          setMessage({
            type: data.error.type,
            text: data.error.message,
          });
        }
      }

      return await res.json();
    },
  });

  return (
    <div className="border rounded-md py-5">
      <table className="border-collapse table-auto w-full text-sm ">
        <thead>
          <tr>
            <th className="border-b font-medium px-4 pt-0 pb-3 text-slate-500 text-left">
              GameID
            </th>
            <th className="border-b font-medium px-4 pt-0 pb-3 text-slate-500 text-left">
              Winner
            </th>
            <th className="border-b font-medium px-4 pt-0 pb-3 text-slate-500 text-left">
              White Moves
            </th>
            <th className="border-b font-medium px-4 pt-0 pb-3 text-slate-500 text-left">
              Black Moves
            </th>
            <th className="border-b font-medium px-4 pt-0 pb-3 text-slate-500 text-left">
              Ended At
            </th>
            <th className="border-b font-medium px-4 pt-0 pb-3 text-slate-500 text-left w-24"></th>
          </tr>
        </thead>
        <tbody>
          {query.data?.map((game) => {
            return (
              <tr key={game.gameId}>
                <td className="border-b border-slate-100 p-4 text-slate-600 ">
                  {game.gameId}
                </td>
                <td className="border-b border-slate-100 p-4 text-slate-600 ">
                  {convertToDiscLabel(game.winnerDisc)}
                </td>
                <td className="border-b border-slate-100 p-4 text-slate-600 ">
                  {game.whiteMoveCount}
                </td>
                <td className="border-b border-slate-100 p-4 text-slate-600 ">
                  {game.blackMoveCount}
                </td>
                <td className="border-b border-slate-100 p-4 text-slate-600 ">
                  {game.endedAt &&
                    new Date(game.endedAt).toLocaleString("ja-JP")}
                </td>
                <td className="border-b border-slate-100 p-4 text-slate-600">
                  <div className="flex justify-center items-center">
                    <Link to={`/games/${game.gameId}/play`}>
                      <button className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-slate-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                          />
                        </svg>
                      </button>
                    </Link>
                    <button className="w-8 h-8 flex justify-center items-center rounded-full hover:bg-slate-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811Z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {query.isLoading && (
            <tr>
              <td colSpan={5} className="text-center text-slate-400 pt-5">
                Loading...
              </td>
            </tr>
          )}

          {query.error && (
            <tr>
              <td colSpan={5} className="text-center text-red-400 pt-5">
                {query.error.message}
              </td>
            </tr>
          )}

          {query.data?.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center text-slate-400 pt-5">
                No game history
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
