import api from "./instance";
import LocalStorageService, {
  UserData as StoredUserData,
} from "../utils/storage";
import ApiBase from "../constans/api-base";

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

/** Gabungan user + karyawan */
export type UserProfile = StoredUserData & KaryawanData;

/** Login */
export async function login(
  email: string,
  password: string
): Promise<{ token: string; user: StoredUserData }> {
  const resp = await api.post(ApiBase.login, { email, password });

  const { token, data: user } = resp.data;

  LocalStorageService.setToken(token);
  LocalStorageService.setUserData(user);

  return { token, user };
}

/** Fetch profile lengkap */
export async function fetchProfile(id_user: number): Promise<UserProfile> {
  const resp = await api.get(`${ApiBase.userDetail}/${id_user}`);

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

  const resp = await api.get(`${ApiBase.profilPhoto}/${user.image_profil}`, {
    responseType: "blob",
  });

  return resp.data;
}

/** Update data profile + foto */
export async function updateProfileForm(fields: {
  id_user: number;
  nama: string;
  email: string;
  role: string;
  nip: string;
  jabatan: string;
  alamat_lengkap: string;
  imageFile?: File;
}): Promise<StoredUserData> {
  const form = new FormData();
  form.append("nama", fields.nama);
  form.append("email", fields.email);
  form.append("role", fields.role);
  form.append("nip", fields.nip);
  form.append("jabatan", fields.jabatan);
  form.append("alamat_lengkap", fields.alamat_lengkap);

  if (fields.imageFile) {
    form.append("image_profil", fields.imageFile); // harus match dengan backend
  }

  const resp = await api.post<{ message: string; data: StoredUserData }>(
    `${ApiBase.userDetail}/${fields.id_user}`,
    form,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
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
  role: string;
  nip: string;
  jabatan: string;
  alamat_lengkap: string;
  imageFile?: File;
}): Promise<any> {
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

  const resp = await api.post(`${ApiBase.register}`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return resp.data;
}

/** Edit user (tanpa password) */
export async function editUserForm(fields: {
  id_user: number;
  nama: string;
  email: string;
  role: string;
  nip: string;
  jabatan: string;
  alamat_lengkap: string;
  imageFile?: File;
}): Promise<any> {
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

  const resp = await api.post(`${ApiBase.editUser}${fields.id_user}`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return resp.data;
}

/** Edit user termasuk password */
export async function editUserWithPasswordForm(fields: {
  id_user: number;
  nama: string;
  email: string;
  password: string;
  role: string;
  nip: string;
  jabatan: string;
  alamat_lengkap: string;
  imageFile?: File;
}): Promise<any> {
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

  const resp = await api.post(`${ApiBase.editUser}${fields.id_user}`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return resp.data;
}

/** Fetch karyawan */
export async function fetchKaryawanList(limit = 10, offset = 0) {
  const resp = await api.get(`${ApiBase.karyawanAll}`, {
    params: { limit, offset },
  });
  return resp.data; // biasanya return { data, total, message }
}

/** Fetch seluruh data absensi */
export async function fetchAbsensiAll(
  tahunbulan: string
): Promise<KaryawanData[]> {
  const resp = await api.post(ApiBase.presensiList, { tahunbulan });
  return resp.data.data;
}

/** Fetch laporan */
export async function fetchLaporanAll(
  tahunbulan: string
): Promise<KaryawanData[]> {
  const resp = await api.get(`${ApiBase.reportAll}?tahunbulan=${tahunbulan}`);
  return resp.data.data;
}

/** Fetch download excel */
export async function fetchExportExcel(tahunbulan: string): Promise<Blob> {
  const response = await api.get(`${ApiBase.export}?tahunbulan=${tahunbulan}`, {
    responseType: "blob",
  });
  return response.data;
}

export async function fetchDashboardStatistik(): Promise<any> {
  const resp = await api.get(ApiBase.dashboardStatistik);
  const { grafik_bulanan, grafik_mingguan, ...rest } = resp.data.data;

  // Ubah grafik_bulanan → array of { label, count }
  const chart_bulanan = grafik_bulanan.map((count: number, i: number) => ({
    label: String(i + 1),
    count,
  }));

  // Ubah grafik_mingguan → S, S, R, K, J, S, M
  const hari = ["S", "S", "R", "K", "J", "S", "M"];
  const chart_mingguan = grafik_mingguan.map((count: number, i: number) => ({
    label: hari[i] || `H${i + 1}`,
    count,
  }));

  return {
    ...rest,
    chart_bulanan,
    chart_mingguan,
  };
}