import { Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export const Auth0ProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();

  const domain = import.meta.env.VITE_DOMAIN_FRONTEND;
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_CALLBACK_URL;
  const audience = import.meta.env.VITE_AUDIENCE;

  const OnRedirectCallback = (appState, error) => {
    if (error) {
      console.error("Error en el callback de Auth0:", error);
      // Verificación segura para evitar errores de undefined
      const errorMessage = error.message || (typeof error === "string" ? error : "Error desconocido");
      const isInvalidState = errorMessage.toLowerCase().includes("invalid state");

      if (isInvalidState) {
        console.log("Estado inválido detectado, limpiando estado y redirigiendo al inicio...");
        // Intenta limpiar el estado local antes de redirigir
        localStorage.removeItem(`@@auth0spajs@@::${domain}::${clientId}::state`);
        navigate("/");
        return;
      }
      navigate("/"); // Redirige al inicio para cualquier otro error
      return;
    }
    navigate(appState?.returnTo || "/tasks");
  };

  if (!(domain && clientId && redirectUri && audience)) {
    console.error("Faltan variables de entorno para configurar Auth0.");
    return null;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: redirectUri, audience: audience }}
      onRedirectCallback={OnRedirectCallback}
      cacheLocation="localstorage" // Usar localStorage para persistencia
    >
      {children}
    </Auth0Provider>
  );
};