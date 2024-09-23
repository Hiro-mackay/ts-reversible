import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Body } from "./body";

export function Layout() {
  return (
    <div className="w-full h-full max-h-full flex flex-col">
      <Header />
      <Body>
        <Outlet />
      </Body>
    </div>
  );
}
