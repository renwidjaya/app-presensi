import Label from "../form/Label";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { useState, useEffect } from "react";
import Input from "../form/input/InputField";
import { useModal } from "../../hooks/useModal";
import { fetchProfile, updateProfileForm } from "../../api";
import LocalStorageService, { EnumRole, UserData } from "../../utils/storage";

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [photoUrl, setPhotoUrl] = useState<string>("/images/default.jpg");
  const [user, setUser] = useState<UserData | null>(null);

  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [email, setEmail] = useState("");
  const [nip, setNip] = useState("");
  const [alamat, setAlamat] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  // Load user & photo from localStorage
  useEffect(() => {
    const profile = LocalStorageService.getUserData();
    setUser(profile);

    if (profile?.image_profil) {
      setPhotoUrl(profile.image_profil);
    }
  }, []);

  // Isi form saat modal dibuka
  useEffect(() => {
    if (isOpen && user) {
      setNama(user.nama || "");
      setJabatan(user.jabatan || "");
      setEmail(user.email || "");
      setNip(user.nip || "");
      setAlamat(user.alamat_lengkap || "");
    }
  }, [isOpen, user]);

  // Preview file lokal
  useEffect(() => {
    if (!selectedPhoto) return;
    const objectUrl = URL.createObjectURL(selectedPhoto);
    setPhotoUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedPhoto]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      // Konversi role ke EnumRole secara aman
      const role: EnumRole =
        user.role === "ADMIN" ? EnumRole.Admin : EnumRole.Karyawan;

      await updateProfileForm({
        id_user: user.id_user,
        id_karyawan: user.id_karyawan,
        nama,
        nama_lengkap: nama,
        jabatan,
        email,
        role,
        nip,
        alamat_lengkap: alamat,
        imageFile: selectedPhoto || undefined,
      });

      const refreshed = await fetchProfile(user.id_user);
      setUser(refreshed);

      if (refreshed.image_profil) {
        setPhotoUrl(refreshed.image_profil);
      }

      setSelectedPhoto(null);
      closeModal();
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img
                src={photoUrl}
                alt="Preview"
                onError={() => setPhotoUrl("/images/default.jpg")}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="order-3 xl:order-2 text-center xl:text-left">
              <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                {user?.nama || "Loading..."}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.role || ""}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.jabatan}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div
          className="relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
          style={{ maxHeight: "80vh" }}
        >
          <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Profile
          </h4>
          <form className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-1 lg:col-span-2">
                <Label>Foto Profil</Label>
                <div className="flex items-center gap-4">
                  <img
                    src={photoUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </div>
              </div>

              <div>
                <Label>Nama Lengkap</Label>
                <Input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Jabatan</Label>
                <Input
                  type="text"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>NIP</Label>
                <Input
                  type="text"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-1 lg:col-span-2">
                <Label>Alamat</Label>
                <Input
                  type="text"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Role</Label>
                <Input
                  type="text"
                  value={user?.role ?? ""}
                  disabled
                  required
                  className="bg-gray-100 dark:bg-gray-800 text-gray-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={closeModal}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
