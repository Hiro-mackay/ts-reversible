import { useEffect, useState } from "react";
import { BLACK, EMPTY, INITIAL_BOARD, WHITE } from "../../consts/game";

export function Boards() {
  const [board, setBoard] = useState(INITIAL_BOARD);

  useEffect(() => {
    (async function () {
      const res = await fetch("/api/games/latest/turns/0");
      const data = await res.json();

      const newBoard = INITIAL_BOARD.map((horizontal, i) =>
        horizontal.map((_, j) => data[i * 8 + j].disc)
      );

      setBoard(newBoard);
    })();
  }, []);

  return (
    <div>
      <div className="flex justify-center">
        <div className="flex flex-col border border-gray-300">
          {board.map((horizontal, i) => (
            <div key={i} className="flex">
              {horizontal.map((discStatus, j) => (
                <Cell key={j} discStatus={discStatus} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type CellProps = { discStatus: number };

function Cell(props: CellProps) {
  return (
    <div className="w-10 h-10 border border-gray-300 flex justify-center items-center">
      <Stone {...props} />
    </div>
  );
}

function Stone({ discStatus }: { discStatus: number }) {
  switch (discStatus) {
    case EMPTY:
      return <></>;

    case BLACK:
      return (
        <div className="w-8 h-8 rounded-full border border-gray-500 bg-black" />
      );

    case WHITE:
      return (
        <div className="w-8 h-8 rounded-full border border-gray-500 bg-white" />
      );

    default:
      return <></>;
  }
}
