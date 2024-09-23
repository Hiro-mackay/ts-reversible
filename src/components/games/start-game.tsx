import { useMutation } from "@tanstack/react-query";
import { appClient } from "../../utils/utils.client";
import { useNavigate } from "react-router-dom";
import { useMessageContext } from "../message/context";

export function StartNewGameButton() {
  const nav = useNavigate();
  const { reset } = useMessageContext();
  const mutation = useMutation({
    mutationKey: ["games", "start"],
    mutationFn: async () => {
      const res = await appClient.api.games.$post();

      return await res.json();
    },
    onSuccess(data) {
      reset();
      nav(`/games/${data.id}/play`);
    },
  });

  return (
    <button
      className={`max-w-max text-white transition-all duration-100 rounded-md px-6 py-3 ${
        mutation.isPending ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-400"
      }`}
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "Starting..." : "Start New Game"}
    </button>
  );
}
