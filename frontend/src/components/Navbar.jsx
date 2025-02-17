import { Link } from "react-router-dom";
import GitHubIcon from "./svgs/GitHubIcon";
import LinkedInIcon from "./svgs/LinkedInIcon";
import XIcon from "./svgs/XIcon";
import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton } from "./auth/logout-button";
import { Logo } from "./Logo";

const Navbar = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <div className="w-full h-16 flex items-center justify-between gap-3 px-4">
     <div className="flex items-center gap-3">
        <Logo />
        {isAuthenticated && <LogoutButton />}
      </div>

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
