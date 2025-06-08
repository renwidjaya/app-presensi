export default function DashboardHeader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg p-4 shadow-sm border flex items-center gap-4">
        <img
          src="/images/user/owner.jpg"
          alt="Admin"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold">Admin</h3>
          <p className="text-sm text-gray-500">admin</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-sm text-gray-500">Total Karyawan</div>
          <div className="text-xl font-semibold mt-1">20</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="text-sm text-gray-500">Hadir Hari Ini</div>
          <div className="text-xl font-semibold mt-1">15</div>
        </div>
      </div>
    </div>
  );
}
