import { useLocation } from "react-router-dom";

export const ErrorPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const message = searchParams.get("message") || "Error desconocido";

  return (
    <div>
      <h1>Error</h1>
      <p>{message}</p>
    </div>
  );
};