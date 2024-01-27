import { Navigate } from "react-router-dom";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "../globalAtom";
import { Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // eslint-disable-next-line no-undef
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
