import { Login } from "@/Pages/Main/Login";
import { Main } from "@/Pages/Main/Main";
import { Register } from "@/Pages/Main/Register";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import ProtectedRoutes from "@/components/ProtectedRoutes";
import { useAuth } from "@/context/AuthContext";
import { Home } from "@/Pages/Dashboard/Home";

function App() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if user is authenticated and on login/register pages
    if (
      currentUser &&
      (location.pathname === "/login" || location.pathname === "/register")
    ) {
      navigate("/dashboard");
    }
  }, [currentUser, location.pathname, navigate]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard/:deckId?" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
