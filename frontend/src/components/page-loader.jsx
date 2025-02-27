import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

export const PageLoader = () => {
  const { isLoading, isAuthenticated, error, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !error) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, error, loginWithRedirect]);

  console.log("PageLoader - isLoading:", isLoading, "isAuthenticated:", isAuthenticated, "error:", error);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-[#1D232A] gap-4">
        <p className="text-lg font-medium text-white">Cargando...</p>
        <span className="loading loading-dots loading-lg text-white"></span>
        <button
          onClick={() => window.location.href = "/"}
          className="text-white underline mt-4"
        >
          Cancelar
        </button>
      </div>
    );
  }

  if (error) {
    const errorMessage = error.message || (typeof error === "string" ? error : "Error desconocido");
    const isInvalidState = errorMessage.toLowerCase().includes("invalid state");

    console.error("Error during authentication in PageLoader:", error, "Message:", errorMessage);

    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center bg-[#1D232A] gap-4">
        <p className="text-lg font-medium text-white">
          {isInvalidState ? "Error: Estado inválido." : `Error: ${errorMessage}.`}
        </p>
        <button
          onClick={() => window.location.href = "/"}
          className="text-white underline mt-4"
        >
          Regresar al Inicio
        </button>
      </div>
    );
  }

  return null;
};