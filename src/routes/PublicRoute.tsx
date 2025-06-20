import { Navigate, Outlet } from "react-router-dom";
import LocalStorageService from "../utils/storage";

export default function PublicRoute() {
  const isAuthenticated = Boolean(LocalStorageService.getToken());

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}
