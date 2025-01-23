import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppRouter from "@/routes/AppRouter";
import { NavbarAuthenticated } from "../components/auth/navbar-authenticated";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const MainLayout = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();

  if (isLoading) {
    return <PageLoader />;
  }

  const shouldUseNavbarAuthenticated =
    isAuthenticated && location.pathname === "/tasks";
  return (
    <>
      {/* Contenedor para el contenido principal (Navbar + AppRouter) */}
      <div className="flex-1 p-6">
        <div className="h-full">
          <div className="w-full container mx-auto">
            {shouldUseNavbarAuthenticated ? (
              <NavbarAuthenticated />
            ) : (
              <Navbar />
            )}
          </div>
          <div className="container pt-24 md:pt-10 mx-auto flex flex-wrap flex-col md:flex-row items-center">
            <AppRouter />
          </div>
        </div>
      </div>

      {/* Footer centrado en la parte inferior */}
      <div className="mt-auto flex justify-center">
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;

// Navbar o NavbarAuthenticated

/* 
--Si necesitamos que navbarAuthenticated se muestre ademas de /tasks podemos modificar la condicion:
const shouldUseDaisyNavbar =
  isAuthenticated && (location.pathname === "/tasks" || location.pathname === "/profile");


-- Si tenemos muchas rutas que requieren el navbarAuthenticated podemos crear un array de rutas y
usar includes:
const authenticatedRoutes = ["/tasks", "/profile", "/dashboard"];
const shouldUseDaisyNavbar =
  isAuthenticated && authenticatedRoutes.includes(location.pathname);
*/
