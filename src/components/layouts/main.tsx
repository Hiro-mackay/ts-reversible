import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Body } from "./body";

export function Layout() {
  return (
    <div className="w-full h-full">
      <Header />
      <Body>
        <Outlet />
      </Body>
    </div>
  );
}
