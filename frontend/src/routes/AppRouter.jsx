import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import About from "@/pages/About";
// import Login from "@/pages/auth/Login";
// import Register from "@/pages/auth/Register";
import TaskList from "@/components/TaskList";
import HeroSection from "@/components/HeroSection";

const AppRouter = () => {
  const isAuthenticated = false;
  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Home /> : <HeroSection />} />
      <Route path="/tasks" element={<TaskList />} />
      <Route path="/about" element={<About />} />
      {/* <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> */}
    </Routes>
  );
};

export default AppRouter;
