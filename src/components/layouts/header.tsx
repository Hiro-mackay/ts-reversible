import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="px-5 py-3 border-b">
      <Link to="/">
        <h1 className="text-2xl font-semibold">Reversible Game</h1>
      </Link>
    </header>
  );
}
