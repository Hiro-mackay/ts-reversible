import { PropsWithChildren } from "react";

export function Layout({ children }: PropsWithChildren) {
  return <div className="w-full h-full">{children}</div>;
}
