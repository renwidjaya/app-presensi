import { useEffect, useState } from "react";
import LocalStorageService, { UserData } from "../../utils/storage";

export default function UserInfoCard() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const stored = LocalStorageService.getUserData();
    setUser(stored);
  }, []);

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Nama
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.nama || user?.nama || "–"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Jabatan
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.jabatan || "–"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.email || "–"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                NIP
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.nip || "–"}
              </p>
            </div>

            <div className="lg:col-span-2">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Alamat
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.alamat_lengkap || "–"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
