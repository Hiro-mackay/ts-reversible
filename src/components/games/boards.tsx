import { BLACK, EMPTY, INITIAL_BOARD, WHITE } from "../../consts/game";

export function Boards() {
  return (
    <div>
      <div className="flex justify-center">
        <div className="flex flex-col border border-gray-300">
          {INITIAL_BOARD.map((horizontal, i) => (
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

function Cell({ discStatus }: { discStatus: number }) {
  const Stone = () => {
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
  };

  return (
    <div className="w-10 h-10 border border-gray-300 flex justify-center items-center">
      <Stone />
    </div>
  );
}
