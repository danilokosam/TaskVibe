// App.jsx
import "./App.css";
import MainLayout from "@/layouts/MainLayout";
import AppRouter from "./routes/AppRouter";
import { useAuth0 } from "@auth0/auth0-react";
import { PageLoader } from "./components/page-loader";

function App() {
  const { isLoading } = useAuth0();

  console.log("IsLoading:", isLoading);

  if (isLoading) {
     return <PageLoader />
  }
  return (
    <div className="leading-normal tracking-normal text-white font-medium bg-cover bg-fixed min-h-screen flex flex-col w-full bg-[#1D232A]">
      <MainLayout />
    </div>
  );
}

export default App;
