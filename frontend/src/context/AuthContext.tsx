import User from "@/types/User";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

type UserContextType = {
  token: string | null;
  currentUser: User | null;
  authenticateUser: (_user: User, _token: string) => void;
  signOut: () => void;
  isAuthenticated: () => boolean;
};

export const AuthContext = createContext<UserContextType>(
  {} as UserContextType
);

interface Props {
  children?: ReactNode;
}

const AuthProvider = ({ children }: Props): React.ReactElement => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("currentUser");
    if (user && token) {
      setToken(token);
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const authenticateUser = (user: User, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setCurrentUser(user);
    setToken(token);
    navigate("/dashboard");
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setToken(null);
    navigate("/login");
  };

  const isAuthenticated = () => {
    return !!currentUser;
  };

  const value = {
    token,
    currentUser,
    authenticateUser,
    signOut,
    loading,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within the context provider");
  }
  return context;
};

export { AuthProvider, useAuth };
