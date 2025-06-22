/**
 * API endpoint constants
 */
const ApiBase = {
  // Authentication
  login: "/api/v1-auth/login",
  register: "/api/v1-auth/register",
  editUser: "/api/v1-auth/user/",
  userDetail: "/api/v1-auth/user",
  userDestroy: "/api/v1-auth/user/",

  // Presensi
  karyawanAll: "/api/v1-presensi/karyawan",
  riwayatAbsensi: "/api/v1-presensi/karyawan/",
  presensiList: "/api/v1-presensi/lists",
  checkin: "/api/v1-presensi/checkin",
  checkinUpdate: "/api/v1-presensi/checkin",
  dashboardStatistik: "/api/v1-presensi/dashboard",
  export: "/api/v1-presensi/export",
  reportAll: "/api/v1-presensi/report/all",
  storePresensi: "/api/v1-presensi/store",
  updatePresensi: "/api/v1-presensi/update/",
  destroyPresensi: "/api/v1-presensi/destroy/",

  // Photo Upload
  profilPhoto: "/profil",
  presensiPhoto: "/presensi",
};

export default ApiBase;
