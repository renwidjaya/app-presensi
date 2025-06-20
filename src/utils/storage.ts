const TOKEN_KEY = "app_presensi_token";
const USER_KEY = "app_presensi_user";

export enum EnumRole {
  Admin = "ADMIN",
  Karyawan = "KARYAWAN",
}

export interface UserData {
  id_user: number;
  id_karyawan: number;
  nama: string;
  email?: string;
  role?: EnumRole;
  nip: string;
  jabatan: string;
  alamat_lengkap: string;
  image_profil?: string;
}

const LocalStorageService = {
  /**
   * Simpan token string ke localStorage
   */
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Ambil token dari localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Simpan data user (object) ke localStorage
   */
  setUserData(user: UserData): void {
    try {
      const json = JSON.stringify(user);
      localStorage.setItem(USER_KEY, json);
    } catch (e) {
      console.error("Error menyimpan user data:", e);
    }
  },

  /**
   * Ambil data user dari localStorage
   */
  getUserData(): UserData | null {
    const json = localStorage.getItem(USER_KEY);
    if (!json) return null;
    try {
      return JSON.parse(json) as UserData;
    } catch (e) {
      console.error("Error parsing user data:", e);
      return null;
    }
  },

  /**
   * Hapus token dan user data dari localStorage
   */
  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export default LocalStorageService;
