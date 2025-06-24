import api from "./instance";
import LocalStorageService, {
  EnumRole,
  UserData as StoredUserData,
} from "../utils/storage";
import ApiBase from "../constans/api-base";

/** Interface untuk data presensi */
interface IPresensi {
  id_absensi: number;
  tanggal: string;
  jam_masuk: string;
  jam_pulang: string;
  lokasi_masuk: string;
  lokasi_pulang: string;
  total_jam_lembur: string;
  kategori: string;
  foto_masuk: string;
  foto_pulang: string;
}

/** Interface untuk data karyawan */
export interface KaryawanData {
  id_karyawan: number;
  nama_lengkap: string;
  nip: string;
  jabatan: string;
  alamat_lengkap: string;
  image_profil?: string;
  presensis?: IPresensi[];
}

export interface KaryawanListItem {
  id_karyawan: number;
  id_user: number;
  nama_lengkap: string;
  nip: string;
  jabatan: string;
  alamat_lengkap: string;
  image_profil: string;
  created_at: string;
  updated_at: string;
  user: {
    email: string;
    role: EnumRole;
  };
}

interface DashboardStatistikResponse {
  total_karyawan: number;
  hadir_hari_ini: number;
  hadir_bulan_ini: number;
  periode: string;
  grafik_bulanan: number[];
  grafik_mingguan: number[];
}

export interface PresensiPayload {
  id_karyawan: string;
  tanggal: string;
  jam_masuk: string;
  jam_pulang: string;
  lokasi_masuk: string;
  lokasi_pulang: string;
  total_jam_lembur: string;
  kategori: string;
}

/** Gabungan user + karyawan */
export type UserProfile = StoredUserData & KaryawanData;

/** Struktur response umum */
interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

/** Login */
export async function login(
  email: string,
  password: string
): Promise<{ token: string; user: StoredUserData }> {
  const resp = await api.post<{ token: string; data: StoredUserData }>(
    ApiBase.login,
    { email, password }
  );

  const { token, data: user } = resp.data;

  LocalStorageService.setToken(token);
  LocalStorageService.setUserData(user);

  return { token, user };
}

/** Fetch profile lengkap */
export async function fetchProfile(id_user: number): Promise<UserProfile> {
  const resp = await api.get<
    ApiResponse<{
      nama: string;
      email: string;
      role: EnumRole;
      karyawan: KaryawanData;
    }>
  >(`${ApiBase.userDetail}/${id_user}`);

  const { nama, email, role, karyawan } = resp.data.data;

  const merged: UserProfile = {
    id_user,
    id_karyawan: karyawan.id_karyawan,
    nama,
    nama_lengkap: karyawan.nama_lengkap,
    email,
    role,
    nip: karyawan.nip,
    jabatan: karyawan.jabatan,
    alamat_lengkap: karyawan.alamat_lengkap,
    image_profil: karyawan.image_profil,
  };

  LocalStorageService.setUserData(merged);
  return merged;
}

/** Ambil foto profil dari backend (Blob) */
export async function fetchProfilePhoto(): Promise<Blob> {
  const user = LocalStorageService.getUserData();
  if (!user?.image_profil) {
    throw new Error("Profile photo not set");
  }

  const resp = await api.get<Blob>(
    `${ApiBase.profilPhoto}/${user.image_profil}`,
    { responseType: "blob" }
  );

  return resp.data;
}

/** user destroy */
export async function destroyUser(id_user: number): Promise<ApiResponse<null>> {
  const resp = await api.delete<ApiResponse<null>>(`${ApiBase.userDestroy}${id_user}`);
  return resp.data;
}

/** Update data profile + foto */
export async function updateProfileForm(
  fields: UserProfile & { imageFile?: File }
): Promise<StoredUserData> {
  const form = new FormData();
  form.append("nama", fields.nama || "");
  form.append("email", fields.email || "");
  form.append("role", String(fields.role || "")); // fix di sini
  form.append("nip", fields.nip || "");
  form.append("jabatan", fields.jabatan || "");
  form.append("alamat_lengkap", fields.alamat_lengkap || "");
  if (fields.imageFile) {
    form.append("image_profil", fields.imageFile);
  }

  const resp = await api.post<ApiResponse<StoredUserData>>(
    `${ApiBase.userDetail}/${fields.id_user}`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  const updated = resp.data.data;
  LocalStorageService.setUserData(updated);
  return updated;
}

/** Register user baru + data karyawan */
export async function registerUser(fields: {
  nama: string;
  email: string;
  password: string;
  role: EnumRole;
  nip: string;
  jabatan: string;
  alamat_lengkap: string;
  imageFile?: File;
}): Promise<ApiResponse<StoredUserData>> {
  const form = new FormData();
  form.append("nama", fields.nama);
  form.append("email", fields.email);
  form.append("password", fields.password);
  form.append("role", fields.role);
  form.append("nip", fields.nip);
  form.append("jabatan", fields.jabatan);
  form.append("alamat_lengkap", fields.alamat_lengkap);
  if (fields.imageFile) {
    form.append("image_profil", fields.imageFile);
  }

  const resp = await api.post<ApiResponse<StoredUserData>>(
    ApiBase.register,
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return resp.data;
}

/** Edit user (tanpa password) */
export async function editUserForm(fields: {
  id_user: number;
  nama: string;
  email: string;
  role: EnumRole;
  nip: string;
  jabatan: string;
  alamat_lengkap: string;
  imageFile?: File;
}): Promise<ApiResponse<StoredUserData>> {
  const form = new FormData();
  form.append("nama", fields.nama);
  form.append("email", fields.email);
  form.append("role", fields.role);
  form.append("nip", fields.nip);
  form.append("jabatan", fields.jabatan);
  form.append("alamat_lengkap", fields.alamat_lengkap);
  if (fields.imageFile) {
    form.append("image_profil", fields.imageFile);
  }

  const resp = await api.post<ApiResponse<StoredUserData>>(
    `${ApiBase.editUser}${fields.id_user}`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return resp.data;
}

/** Edit user termasuk password */
export async function editUserWithPasswordForm(fields: {
  id_user: number;
  nama: string;
  email: string;
  password: string;
  role: EnumRole;
  nip: string;
  jabatan: string;
  alamat_lengkap: string;
  imageFile?: File;
}): Promise<ApiResponse<StoredUserData>> {
  const form = new FormData();
  form.append("nama", fields.nama);
  form.append("email", fields.email);
  form.append("password", fields.password);
  form.append("role", fields.role);
  form.append("nip", fields.nip);
  form.append("jabatan", fields.jabatan);
  form.append("alamat_lengkap", fields.alamat_lengkap);
  if (fields.imageFile) {
    form.append("image_profil", fields.imageFile);
  }

  const resp = await api.post<ApiResponse<StoredUserData>>(
    `${ApiBase.editUser}${fields.id_user}`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return resp.data;
}

/** Fetch karyawan */
export async function fetchKaryawanList(
  limit = 50,
  offset = 0
): Promise<KaryawanListItem[]> {
  const resp = await api.get<ApiResponse<KaryawanListItem[]>>(
    ApiBase.karyawanAll,
    {
      params: { limit, offset },
    }
  );
  return resp.data.data;
}

/** Fetch seluruh data absensi */
export async function fetchAbsensiAll(
  tahunbulan: string
): Promise<KaryawanData[]> {
  const resp = await api.post<ApiResponse<KaryawanData[]>>(
    ApiBase.presensiList,
    { tahunbulan }
  );
  return resp.data.data;
}

/** Fetch laporan */
export async function fetchLaporanAll(
  tahunbulan: string
): Promise<KaryawanData[]> {
  const resp = await api.get<ApiResponse<KaryawanData[]>>(
    `${ApiBase.reportAll}?tahunbulan=${tahunbulan}`
  );
  return resp.data.data;
}

/** Fetch download excel */
export async function fetchExportExcel(tahunbulan: string): Promise<Blob> {
  const response = await api.get<Blob>(
    `${ApiBase.export}?tahunbulan=${tahunbulan}`,
    { responseType: "blob" }
  );
  return response.data;
}

/** Fetch statistik dashboard */
export async function fetchDashboardStatistik(): Promise<{
  total_karyawan: number;
  hadir_hari_ini: number;
  hadir_bulan_ini: number;
  periode: string;
  chart_bulanan: { label: string; count: number }[];
  chart_mingguan: { label: string; count: number }[];
}> {
  const resp = await api.get<ApiResponse<DashboardStatistikResponse>>(
    ApiBase.dashboardStatistik
  );

  const {
    total_karyawan,
    hadir_hari_ini,
    hadir_bulan_ini,
    periode,
    grafik_bulanan,
    grafik_mingguan,
  } = resp.data.data;

  const chart_bulanan = grafik_bulanan.map((count, i) => ({
    label: String(i + 1),
    count,
  }));

  const hari = ["S", "S", "R", "K", "J", "S", "M"];
  const chart_mingguan = grafik_mingguan.map((count, i) => ({
    label: hari[i] || `H${i + 1}`,
    count,
  }));

  return {
    total_karyawan,
    hadir_hari_ini,
    hadir_bulan_ini,
    periode,
    chart_bulanan,
    chart_mingguan,
  };
}

/** Store Presensi */
export async function storePresensi(payload: PresensiPayload) {
  const res = await api.post(ApiBase.storePresensi, payload);
  return res.data;
}

/** Update Presensi */
export async function updatePresensi(id: number, payload: PresensiPayload) {
  const res = await api.put(`${ApiBase.updatePresensi}${id}`, payload);
  return res.data;
}

/** Destroy Presensi */
export async function destroyPresensi(id: number) {
  const res = await api.delete(`${ApiBase.destroyPresensi}${id}`);
  return res.data;
}