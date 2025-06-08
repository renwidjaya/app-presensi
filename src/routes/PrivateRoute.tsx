
import { Navigate, Outlet } from "react-router";

const isAuthenticated = true;

export default function PrivateRoute() {
  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
}

