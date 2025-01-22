import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleStartNow = () => {
    navigate("/login");
  };

  const handleMoreInfo = () => {
    navigate("/about");
  };

  return (
    <>
      <div className="flex flex-col w-full xl:w-2/5 justify-center lg:items-start overflow-y-hidden">
        <h1 className="my-4 text-3xl md:text-5xl text-white font-bold leading-tight text-center md:text-left">
          Start organizing and collaborating with
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-purple-500 to-blue-500">
            TaskVibe
          </span>
        </h1>
        <p className="leading-normal text-base md:text-2xl mb-8 text-center md:text-left opacity-70">
          Your success begins with good organization.
        </p>
        <div className="flex flex-col gap-5 sm:gap-10  sm:flex-row sm:space-evenly md:justify-start">
          <button
            className="btn btn-primary text-zinc-100"
            onClick={handleStartNow}
          >
            Start Now
          </button>
          <button
            className="btn btn-active text-zinc-100"
            onClick={handleMoreInfo}
          >
            More Info
          </button>
        </div>
      </div>
      <div className="w-full xl:w-3/5 p-5 mt-14">
        <img
          alt="TaskVibe Image"
          className="mx-auto w-full md:w-4/5 transform -rotate-6 transition hover:scale-105 duration-700 ease-in-out hover:rotate-6"
          src="src/assets/img/macbock.svg"
        />
      </div>
    </>
  );
};

export default HeroSection;
