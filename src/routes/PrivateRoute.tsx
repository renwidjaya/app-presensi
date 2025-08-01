
import { Navigate, Outlet } from "react-router-dom";
import LocalStorageService from "../utils/storage";

export default function PrivateRoute() {
  const isAuthenticated = Boolean(LocalStorageService.getToken());

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
}

