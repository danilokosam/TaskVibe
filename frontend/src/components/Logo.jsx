import { Link } from "react-router-dom";

export const Logo = () => (
  <Link to="/" className="no-underline" aria-label="Ir a la página principal">
    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 select-none">
      TaskVibe
    </h1>
  </Link>
);
