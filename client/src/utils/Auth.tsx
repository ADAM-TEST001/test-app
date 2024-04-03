import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { Navigate, Outlet } from "react-router-dom";

const Auth = () => {
  return Authenticated() ? <Outlet /> : <Navigate to="/" />;
};

export default Auth;

const Authenticated = () => {
  const token = localStorage.getItem("token");
  const exp = localStorage.getItem("exp");

  if (token && exp) {
    const auth = parseInt(exp) * 1000 > Date.now();
    //console.log(auth);

    if (!auth) {
      toast.error("Session expired LOG IN AGAIN");
      localStorage.clear();
    }

    return auth;

    // if (!auth) {
    //   localStorage.removeItem("token");
    //   return false;
    // } else true;
  } else {
    false;
  }
};
