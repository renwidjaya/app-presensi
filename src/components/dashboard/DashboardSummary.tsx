import { UserIcon, CheckLineIcon, CalenderIcon } from "../../icons";

export default function DashboardSummary() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="text-sm text-gray-500">Total Karyawan</div>
        <div className="flex items-center gap-2 mt-1 text-xl font-semibold">
          <UserIcon className="w-5 h-5" />
          <span>20</span>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="text-sm text-gray-500">Hadir Bulan Ini</div>
        <div className="flex items-center gap-2 mt-1 text-xl font-semibold">
          <CheckLineIcon className="w-5 h-5" />
          <span>150</span>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="text-sm text-gray-500">Periode</div>
        <div className="flex items-center gap-2 mt-1 text-sm">
          <CalenderIcon className="w-5 h-5" />
          <span>01/03/2024 — 31/03/2024</span>
        </div>
      </div>
    </div>
  );
}
