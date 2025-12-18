import { useAuth } from "../Components/LoginContext";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) return <Navigate to="/" replace />;

  return children;
};

export default AuthRoute;
