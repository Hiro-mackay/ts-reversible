import { PropsWithChildren } from "react";

export function Body({ children }: PropsWithChildren) {
  return <div className="flex-1 overflow-hidden">{children}</div>;
}
