import { PropsWithChildren } from "react";

export function Body({ children }: PropsWithChildren) {
  return <div className="p-5">{children}</div>;
}
