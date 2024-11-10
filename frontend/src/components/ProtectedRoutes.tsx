import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const { currentUser } = useAuth();
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
