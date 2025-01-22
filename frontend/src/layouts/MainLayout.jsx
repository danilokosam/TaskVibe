// layouts/MainLayout.jsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppRouter from "@/routes/AppRouter";

const MainLayout = () => {
  return (
    <>
      {/* Contenedor para el contenido principal (Navbar + AppRouter) */}
      <div className="flex-1 p-6">
        <div className="h-full">
          <div className="w-full container mx-auto">
            <Navbar />
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