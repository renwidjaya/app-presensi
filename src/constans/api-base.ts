/**
 * API endpoint constants
 */
const ApiBase = {
  // Authentication
  login: "/api/v1-auth/login",
  register: "/api/v1-auth/register",
  userDetail: "/api/v1-auth/user",

  // Presensi
  riwayatAbsensi: "/api/v1-presensi/karyawan/",
  presensiList: "/api/v1-presensi/lists",
  checkin: "/api/v1-presensi/checkin",
  checkinUpdate: "/api/v1-presensi/checkin",
  statistik: "/api/v1-presensi/statistik",
  export: "/api/v1-presensi/export",
  reportAll: "/api/v1-presensi/report/all",

  // Photo Upload
  profilPhoto: "/profil",
  presensiPhoto: "/presensi",
};

export default ApiBase;
