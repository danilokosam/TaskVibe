import { Link } from "react-router-dom"; // Importa Link desde react-router-dom
import GitHubIcon from "./svgs/GitHubIcon";
import LinkedInIcon from "./svgs/LinkedInIcon";
import XIcon from "./svgs/XIcon";

const Navbar = () => {
  return (
    <div className="w-full h-16 flex items-center justify-between gap-3">
      {/* Envuelve el h1 con Link para redirigir a la página principal */}
      <Link to="/" className="no-underline" aria-label="Ir a la página principal">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 select-none">
          TaskVibe
        </h1>
      </Link>

      <div className="flex w-1/2 justify-center items-center gap-1 sm:justify-end">
        <a
          className="inline-block text-blue-300 no-underline hover:text-pink-500 hover:text-underline text-center h-full p-1 md:h-auto md:p-4 transform hover:scale-125 duration-300 ease-in-out"
          href="https://x.com/Danilokosam"
          target="_blank"
        >
          <XIcon width="1.5em" height="1.5em" />
        </a>
        <a
          className="inline-block text-blue-300 no-underline hover:text-pink-500 hover:text-underline text-center h-full p-1 md:h-auto md:p-4 transform hover:scale-125 duration-300 ease-in-out"
          href="https://www.linkedin.com/in/alejandro-vargas-371394263/"
          target="_blank"
        >
          <LinkedInIcon width="1.5em" height="1.5em" />
        </a>
        <a
          className="inline-block text-blue-300 no-underline hover:text-pink-500 hover:text-underline text-center h-full p-1 md:h-auto md:p-4 transform hover:scale-125 duration-300 ease-in-out"
          href="https://github.com/danilokosam/TaskVibe"
          target="_blank"
        >
          <GitHubIcon width="1.5em" height="1.5em" />
        </a>
      </div>
    </div>
  );
};

export default Navbar;