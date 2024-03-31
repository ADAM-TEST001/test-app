import { Navigate, Outlet } from "react-router-dom";

const Auth = () => {
  const isAuthenticated = localStorage.getItem("token");

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default Auth;
