import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { DownloadIcon } from "../../icons";
import { fetchAbsensiAll, fetchExportExcel } from "../../api";
import { Modal } from "../ui/modal";
import { KaryawanData } from "../../api";

interface PresensiWithKaryawan {
  id_absensi: number;
  tanggal: string;
  jam_masuk: string;
  jam_pulang: string;
  lokasi_masuk: string;
  lokasi_pulang: string;
  total_jam_lembur: string;
  kategori: string;
  foto_masuk: string;
  foto_pulang: string;
  karyawan: KaryawanData;
}

export default function BasicTableLaporan() {
  const itemsPerPage = 10;
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<KaryawanData[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
        const res = await fetchAbsensiAll(month);
        setData(res);
      } catch (err) {
        console.error("Gagal mengambil laporan:", err);
      }
    }
    load();
  }, [month]);

  const allPresensi: PresensiWithKaryawan[] = data.flatMap((karyawan) =>
    (karyawan.presensis || []).map((p) => ({
      ...p,
      karyawan,
    }))
  );

  const totalPages = Math.ceil(allPresensi.length / itemsPerPage);
  const paginatedData = allPresensi.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportExcel = async () => {
    try {
      const response = await fetchExportExcel(month);
      const blob =
        response instanceof Blob
          ? response
          : new Blob([response], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `laporan-presensi-${month}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal export Excel:", err);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-4 py-3 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-3 justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <label
                htmlFor="month"
                className="text-sm font-semibold text-gray-800 dark:text-gray-200"
              >
                Bulan Presensi
              </label>
              <input
                id="month"
                type="month"
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-fit border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <button
              onClick={() => {
                const now = new Date();
                const bulanIni = `${now.getFullYear()}-${String(
                  now.getMonth() + 1
                ).padStart(2, "0")}`;
                setMonth(bulanIni);
                setCurrentPage(1);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded shadow"
            >
              Tampilkan Bulan Ini
            </button>
          </div>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded shadow"
          >
            <DownloadIcon className="w-4 h-4" />
            Export Excel
          </button>
        </div>
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

      <div className="flex flex-wrap items-center justify-between gap-2 w-full">
        <span className="text-sm text-gray-600">
          Menampilkan {paginatedData.length} dari halaman {currentPage}
        </span>

        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-2 py-1 text-sm border rounded disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 text-sm rounded border ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-sm border rounded disabled:opacity-50"
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
