import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Callback component mounted");
    console.log("Current URL:", window.location.href);
    console.log("Search params:", window.location.search);

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    console.log("Extracted code:", code);

    if (!code) {
      console.error("No authorization code provided");
      navigate("/error?message=no-auth-code");
      return;
    }

    // Cambiar la URL al endpoint de ngrok del backend
    fetch(`https://8113-2a0c-5a80-5402-b600-fd88-abfe-58b4-782b.ngrok-free.app/callback?code=${encodeURIComponent(code)}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(async (response) => {
        if (!response.ok) {
          // Intentar leer el cuerpo de la respuesta para debug
          const text = await response.text();
          console.error('Response body:', text);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const accessToken = data.access_token;
        const idToken = data.id_token;

        if (!accessToken || !idToken) {
          throw new Error("Missing tokens in response");
        }

        console.log("Access Token:", accessToken);
        console.log("ID Token:", idToken);

        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("id_token", idToken);

        navigate("/tasks");
      })
      .catch((error) => {
        console.error("Error al obtener tokens:", error);
        navigate("/error?message=token-error");
      });

    return () => {
      console.log("Callback component unmounting");
    };
  }, [navigate]);

  return (
    <div>
      <h1>Procesando autenticación...</h1>
    </div>
  );
};