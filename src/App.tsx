import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Dashboard/Home";
import AppLayout from "./layout/AppLayout";
import SignIn from "./pages/AuthPages/SignIn";
import UserProfiles from "./pages/UserProfiles";
import ListLaporan from "./pages/Laporan/ListLaporan";
import ListPresensi from "./pages/Presensi/ListPresensi";
import ListKaryawan from "./pages/Karyawan/ListKaryawan";
import { ScrollToTop } from "./components/common/ScrollToTop";

import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public (only for non-authenticated) */}
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<SignIn />} />
        </Route>

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          {/* AppLayout with sidebar/navbar */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="karyawan" element={<ListKaryawan />} />
            <Route path="presensi" element={<ListPresensi />} />
            <Route path="laporan" element={<ListLaporan />} />
            <Route path="profile" element={<UserProfiles />} />
          </Route>
        </Route>

        {/* Fallback: redirect unknown to home or signin */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
