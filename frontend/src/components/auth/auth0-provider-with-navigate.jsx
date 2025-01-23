import { Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export const Auth0ProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();

  // Pendiente de implementar, junto con la configuracion de vite para .env
  const domain = import.meta.env.VITE_DOMAIN_FRONTEND;
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_CALLBACK_URL;

  const OnRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname);
    //window.location.pathname
  };

  if (!(domain && clientId && redirectUri)) {
    return null;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: redirectUri }}
      onRedirectCallback={OnRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};
