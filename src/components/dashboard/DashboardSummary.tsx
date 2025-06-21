import { useEffect, useState } from "react";
import { fetchDashboardStatistik } from "../../api";
import { UserIcon, CheckLineIcon, CalenderIcon } from "../../icons";

interface DashboardData {
  total_karyawan: number;
  total_hadir_hari_ini: number;
  total_hadir_bulan_ini: number;
  periode: string;
}

export default function DashboardSummary() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStatistik()
      .then((res) => {
        setData(res);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="text-sm text-gray-500">Total Karyawan</div>
        <div className="flex items-center gap-2 mt-1 text-xl font-semibold">
          <UserIcon className="w-5 h-5" />
          <span>{data?.total_karyawan}</span>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="text-sm text-gray-500">Hadir Hari Ini</div>
        <div className="flex items-center gap-2 mt-1 text-xl font-semibold">
          <CheckLineIcon className="w-5 h-5" />
          <span>
            {data?.total_hadir_hari_ini ? data?.total_hadir_hari_ini : 0}
          </span>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="text-sm text-gray-500">Hadir Bulan Ini</div>
        <div className="flex items-center gap-2 mt-1 text-xl font-semibold">
          <CheckLineIcon className="w-5 h-5" />
          <span>
            {data?.total_hadir_bulan_ini ? data?.total_hadir_bulan_ini : 0}
          </span>
        </div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="text-sm text-gray-500">Periode</div>
        <div className="flex items-center gap-2 mt-1 text-sm">
          <CalenderIcon className="w-5 h-5" />
          <span>{data?.periode}</span>
        </div>
      </div>
    </div>
  );
}
