import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import About from "@/pages/About";
// import TaskList from "@/components/TaskList";
import { HomeWithoutAuthenticated } from "@/pages/HomeWithoutAuthenticated";
import { AuthenticationGuard } from "@/components/auth/authentication-guard";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeWithoutAuthenticated />} />
      <Route path="/about" element={<About />} />
      <Route path="/tasks" element={<AuthenticationGuard component={Home} />} />
    </Routes>
  );
};

export default AppRouter;
