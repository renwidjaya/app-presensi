import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Select from "react-select";

interface Presensi {
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
}

interface Karyawan {
  id_karyawan: number;
  nama_lengkap: string;
  nip: string;
  jabatan: string;
  image_profil: string;
  presensis: Presensi[];
}

const tableData: Karyawan[] = [
  {
    id_karyawan: 1,
    nama_lengkap: "Rendi Widjaya",
    nip: "199201012021011001",
    jabatan: "Fullstack Developer",
    image_profil: "/images/user/user-17.jpg",
    presensis: [
      {
        id_absensi: 8,
        tanggal: "2025-06-09",
        jam_masuk: "08:00:00",
        jam_pulang: "18:00:00",
        lokasi_masuk: "Jl Cabe Raya",
        lokasi_pulang: "Jl Cabe Raya",
        total_jam_lembur: "2",
        kategori: "MASUK_KERJA",
        foto_masuk: "/images/presensi/presensi-1.jpg",
        foto_pulang: "/images/presensi/presensi-2.jpg",
      },
      {
        id_absensi: 5,
        tanggal: "2025-06-08",
        jam_masuk: "08:00:00",
        jam_pulang: "17:00:00",
        lokasi_masuk: "Kantor Utama",
        lokasi_pulang: "Jl Cabe Raya",
        total_jam_lembur: "1.5",
        kategori: "MASUK_KERJA",
        foto_masuk: "/images/presensi/foto-masuk.jpg",
        foto_pulang: "/images/presensi/foto-pulang.jpg",
      },
    ],
  },
  {
    id_karyawan: 2,
    nama_lengkap: "Indrawan S.Kom",
    nip: "199201012021011002",
    jabatan: "Fullstack Developer",
    image_profil: "/images/user/user-18.jpg",
    presensis: [],
  },
];

export default function BasicTablePresensi() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKaryawan, setSelectedKaryawan] = useState<string | null>(null);
  const itemsPerPage = 5;

  const allPresensi = tableData.flatMap((karyawan) =>
    karyawan.presensis.map((p) => ({
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

  const options = [
    { value: null, label: "Semua" },
    ...tableData.map((k) => ({ value: k.nama_lengkap, label: k.nama_lengkap })),
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="w-full max-w-xs">
          <Select
            options={options}
            value={
              options.find((opt) => opt.value === selectedKaryawan) ||
              options[0]
            }
            onChange={(selected) => {
              setSelectedKaryawan(selected?.value || null);
              setCurrentPage(1);
            }}
            isSearchable
            placeholder="Pilih Karyawan..."
          />
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
                  <div className="text-xs text-gray-500">
                    {item.lokasi_masuk}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">
                    {item.jam_pulang}
                  </div>
                  <div className="text-xs text-gray-500">
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
                    src={item.foto_masuk}
                    alt="foto masuk"
                    className="w-10 h-10 rounded border object-cover"
                  />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <img
                    src={item.foto_pulang}
                    alt="foto pulang"
                    className="w-10 h-10 rounded border object-cover"
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
    </div>
  );
}
