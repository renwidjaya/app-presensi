import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ListKaryawan from "./pages/Karyawan/ListKaryawan";
import ListLaporan from "./pages/Laporan/ListLaporan";
import ListPresensi from "./pages/Presensi/ListPresensi";
import UserProfiles from "./pages/UserProfiles";
import PrivateRoute from "./routes/PrivateRoute";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route path="/karyawan" element={<ListKaryawan />} />
            <Route path="/presensi" element={<ListPresensi />} />
            <Route path="/laporan" element={<ListLaporan />} />
            <Route path="/profile" element={<UserProfiles />} />
          </Route>
        </Route>

        {/* Public Route */}
        <Route path="/signin" element={<SignIn />} />

      </Routes>
    </Router>
  );
}
