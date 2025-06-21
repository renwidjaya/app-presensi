import PageMeta from "../../components/common/PageMeta";
import DashboardSummary from "../../components/dashboard/DashboardSummary";
import MonthlyPresenceChart from "../../components/dashboard/MonthlyPresenceChart";
import WeeklyPresenceChart from "../../components/dashboard/WeeklyPresenceChart";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard Absensi"
        description="Halaman dashboard utama untuk sistem absensi"
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Admin Info & Ringkasan */}
        <div className="col-span-12">
          <DashboardSummary />
        </div>

        {/* Grafik Kehadiran */}
        <div className="col-span-12 xl:col-span-6">
          <MonthlyPresenceChart />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <WeeklyPresenceChart />
        </div>
      </div>
    </>
  );
}
