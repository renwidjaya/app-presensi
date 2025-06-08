export default function UserInfoCard() {
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
                Nama Lengkap
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Rendi Widjaya
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Jabatan
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Admin
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                rendi@gmail.com
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                No. HP
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                081234567890
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Alamat
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Jl. Raya No. 123, Jakarta
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
