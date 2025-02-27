import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import About from "@/pages/About";
import { HomeWithoutAuthenticated } from "@/pages/HomeWithoutAuthenticated";
import { AuthenticationGuard } from "@/components/auth/authentication-guard";
import { useAuth0 } from "@auth0/auth0-react";

const CallbackPage = () => {
  const { isLoading, isAuthenticated, error, loginWithRedirect } = useAuth0();

  console.log("CallbackPage - isLoading:", isLoading, "isAuthenticated:", isAuthenticated, "error:", error);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("Error during authentication:", error);
    // Verificación segura para evitar errores de undefined
    const errorMessage = error.message || (typeof error === "string" ? error : "Error desconocido");
    const isInvalidState = errorMessage.toLowerCase().includes("invalid state");

    if (isInvalidState) {
      console.log("Estado inválido detectado, redirigiendo al inicio...");
      return (
        <div>
          Error: Estado inválido. <button onClick={() => window.location.href = "/"}>Regresar al Inicio</button>
        </div>
      );
    }

    return (
      <div>
        Error: {errorMessage}. <button onClick={() => window.location.href = "/"}>Regresar al Inicio</button>
      </div>
    );
  }

  return <Navigate to="/tasks" replace />;
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeWithoutAuthenticated />} />
      <Route path="/about" element={<About />} />
      <Route path="/tasks" element={<AuthenticationGuard component={Home} />} />
      <Route path="/callback" element={<CallbackPage />} />
    </Routes>
  );
};

export default AppRouter;