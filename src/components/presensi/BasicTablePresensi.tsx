import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Select from "react-select";
import { fetchAbsensiAll, KaryawanData } from "../../api";
import { Modal } from "../ui/modal";

const months = [
  { label: "Januari", value: "01" },
  { label: "Februari", value: "02" },
  { label: "Maret", value: "03" },
  { label: "April", value: "04" },
  { label: "Mei", value: "05" },
  { label: "Juni", value: "06" },
  { label: "Juli", value: "07" },
  { label: "Agustus", value: "08" },
  { label: "September", value: "09" },
  { label: "Oktober", value: "10" },
  { label: "November", value: "11" },
  { label: "Desember", value: "12" },
];

const years = Array.from({ length: 5 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { label: `${year}`, value: `${year}` };
});

export default function BasicTablePresensi() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<KaryawanData[]>([]);
  const [selectedKaryawan, setSelectedKaryawan] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()].value
  );
  const [selectedYear, setSelectedYear] = useState(
    `${new Date().getFullYear()}`
  );

  const openPreview = (src: string) => {
    setPreviewImage(src);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewImage(null);
    setIsPreviewOpen(false);
  };

  useEffect(() => {
    async function load() {
      try {
        const tahunbulan = `${selectedYear}-${selectedMonth}`;
        const data = await fetchAbsensiAll(tahunbulan);
        setTableData(data);
      } catch (err) {
        console.error("Gagal memuat data presensi:", err);
      }
    }
    load();
  }, [selectedMonth, selectedYear]);

  const allPresensi = tableData.flatMap((karyawan: any) =>
    karyawan.presensis.map((p: any) => ({
      ...p,
      karyawan,
    }))
  );

  const filteredPresensi = selectedKaryawan
    ? allPresensi.filter((p) => p.karyawan.nama_lengkap === selectedKaryawan)
    : allPresensi;

  const totalPages = Math.ceil(filteredPresensi.length / itemsPerPage);
  const paginatedData = filteredPresensi.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const karyawanOptions = [
    { value: null, label: "Semua" },
    ...tableData.map((k) => ({ value: k.nama_lengkap, label: k.nama_lengkap })),
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 pt-4 pb-2">
        <Select
          options={months}
          value={months.find((m) => m.value === selectedMonth)}
          onChange={(selected) => {
            if (selected) setSelectedMonth(selected.value);
            setCurrentPage(1);
          }}
          placeholder="Pilih Bulan"
        />
        <Select
          options={years}
          value={years.find((y) => y.value === selectedYear)}
          onChange={(selected) => {
            if (selected) setSelectedYear(selected.value);
            setCurrentPage(1);
          }}
          placeholder="Pilih Tahun"
        />
        <Select
          options={karyawanOptions}
          value={
            karyawanOptions.find((opt) => opt.value === selectedKaryawan) ||
            karyawanOptions[0]
          }
          onChange={(selected) => {
            setSelectedKaryawan(selected?.value || null);
            setCurrentPage(1);
          }}
          isSearchable
          placeholder="Pilih Karyawan"
        />
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader className="px-4 py-3 font-semibold text-left">
                Tanggal
              </TableCell>
              <TableCell isHeader className="px-4 py-3 font-semibold text-left">
                Nama
              </TableCell>
              <TableCell isHeader className="px-4 py-3 font-semibold text-left">
                Masuk
              </TableCell>
              <TableCell isHeader className="px-4 py-3 font-semibold text-left">
                Pulang
              </TableCell>
              <TableCell isHeader className="px-4 py-3 font-semibold text-left">
                Lembur
              </TableCell>
              <TableCell isHeader className="px-4 py-3 font-semibold text-left">
                Kategori
              </TableCell>
              <TableCell isHeader className="px-4 py-3 font-semibold text-left">
                Foto Masuk
              </TableCell>
              <TableCell isHeader className="px-4 py-3 font-semibold text-left">
                Foto Pulang
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id_absensi}>
                <TableCell className="px-4 py-3">{item.tanggal}</TableCell>
                <TableCell className="px-4 py-3">
                  {item.karyawan.nama_lengkap}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">
                    {item.jam_masuk}
                  </div>
                  <div className="text-xs text-gray-500 italic">
                    {item.lokasi_masuk}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">
                    {item.jam_pulang}
                  </div>
                  <div className="text-xs text-gray-500 italic">
                    {item.lokasi_pulang}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3">
                  {item.total_jam_lembur} Jam
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Badge color="info" size="sm">
                    {item.kategori}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <img
                    src={item.foto_masuk || "/images/default.jpg"}
                    alt="Foto Masuk"
                    className="w-12 h-12 rounded border object-cover cursor-pointer"
                    onClick={() =>
                      openPreview(item.foto_masuk || "/images/default.jpg")
                    }
                    onError={(e) => {
                      const fallback = "/images/default.jpg";
                      if (e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                  />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <img
                    src={item.foto_pulang || "/images/default.jpg"}
                    alt="Foto Pulang"
                    className="w-12 h-12 rounded border object-cover cursor-pointer"
                    onClick={() =>
                      openPreview(item.foto_pulang || "/images/default.jpg")
                    }
                    onError={(e) => {
                      const fallback = "/images/default.jpg";
                      if (e.currentTarget.src !== fallback) {
                        e.currentTarget.src = fallback;
                      }
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center p-4 border-t border-gray-100">
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <Modal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        className="max-w-[500px] m-4"
      >
        <div className="p-4 flex flex-col items-center justify-center">
          <img
            src={previewImage ?? "/images/default.jpg"}
            alt="Preview"
            className="max-w-full max-h-[80vh] rounded"
            onError={(e) => {
              const fallback = "/images/default.jpg";
              if (e.currentTarget.src !== fallback) {
                e.currentTarget.src = fallback;
              }
            }}
          />
        </div>
      </Modal>
    </div>
  );
}
