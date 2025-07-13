import { ReactElement } from "react";
import toast from "react-hot-toast";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  children?: ReactElement;
  isAuth: boolean;
  adminOnly?: boolean;
  admin?: boolean;
  redirect?: string;
}

const ProtectedRoute = ({
  isAuth,
  children,
  adminOnly,
  admin,
  redirect = "/login",
}: Props) => {
  if (!isAuth) {
    toast.error("Please login first!");
    return <Navigate to={redirect} />;
  }

  if (adminOnly && !admin) {
    toast.error("Please login first!");
    return <Navigate to={redirect} />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
