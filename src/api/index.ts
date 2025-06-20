import api from "./instance";
import LocalStorageService, {
  UserData as StoredUserData,
} from "../utils/storage";
import ApiBase from "../constans/api-base";

/**
 * Interface for nested data karyawan
 */
export interface KaryawanData {
  id_karyawan: number;
  nama_lengkap: string;
  nip: string;
  jabatan: string;
  alamat_lengkap: string;
  image_profil?: string;
}

/**
 * Interface for combined user & karyawan data
 */
export type UserProfile = StoredUserData & KaryawanData;

/**
 * Login user via fetch
 */
export async function login(
  email: string,
  password: string
): Promise<{ token: string; user: StoredUserData }> {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}${ApiBase.login}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }
  );
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Login failed");
  }
  const result = await response.json();
  const { token, data: user } = result;

  // Persist
  LocalStorageService.setToken(token);
  LocalStorageService.setUserData(user);

  return { token, user };
}

/**
 * Fetch detail profile via fetch API by user ID
 */
export async function fetchProfile(id_user: number): Promise<UserProfile> {
  const token = LocalStorageService.getToken();
  if (!token) throw new Error("No token available");

  const resp = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}${ApiBase.userDetail}/${id_user}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.message || "Fetch profile failed");
  }

  const json = await resp.json();
  const { nama, email, role, karyawan } = json.data;

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

/**
 * Fetch profile photo blob using fetch
 */
export async function fetchProfilePhoto(): Promise<Blob> {
  const user = LocalStorageService.getUserData();
  if (!user?.image_profil) {
    throw new Error("Profile photo not set");
  }
  const token = LocalStorageService.getToken();

  const resp = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}${ApiBase.profilPhoto}/${
      user.image_profil
    }`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!resp.ok) throw new Error("Failed to fetch photo");

  return resp.blob();
}

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
    form.append("image_profil", fields.imageFile); // pastikan nama field cocok dengan backend
  }

  const resp = await api.post<{ message: string; data: StoredUserData }>(
    `${ApiBase.userDetail}/${fields.id_user}`,
    form // <--- biarkan FormData dikirim tanpa header khusus
    // jangan tambahkan "Content-Type", biarkan Axios urus sendiri
  );

  const updated = resp.data.data;
  LocalStorageService.setUserData(updated);
  return updated;
}
