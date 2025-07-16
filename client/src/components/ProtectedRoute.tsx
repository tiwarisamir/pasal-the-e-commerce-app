import { ReactElement } from "react";
import toast from "react-hot-toast";
import { Navigate, Outlet } from "react-router-dom";
import { getUserDetail } from "../utils/features";

interface Props {
  children?: ReactElement;
  adminOnly?: boolean;
  redirect?: string;
}

const ProtectedRoute = ({
  children,
  adminOnly,
  redirect = "/login",
}: Props) => {
  const user = getUserDetail();

  if (!user) {
    toast.error("Please login first!");
    return <Navigate to={redirect} />;
  }

  if (adminOnly) {
    if (user.role !== "admin") {
      toast.error("You are unauthorized to use this route");
      return <Navigate to={redirect} />;
    }
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
