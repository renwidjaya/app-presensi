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
import {
  destroyPresensi,
  fetchAbsensiAll,
  storePresensi,
  updatePresensi,
} from "../../api";
import { Modal } from "../ui/modal";
import { KaryawanData } from "../../api";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Alert from "../ui/alert/Alert";

export const kategoriOptions = [
  { label: "Masuk Kerja", value: "MASUK_KERJA" },
  { label: "Izin Kerja", value: "IZIN_KERJA" },
  { label: "Cuti Kerja", value: "CUTI_KERJA" },
  { label: "Dinas Kerja", value: "DINAS_KERJA" },
] as const;

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

  const [alert, setAlert] = useState<{
    variant: "error" | "success";
    title: string;
    message: string;
  } | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isModalPresensiOpen, setIsModalPresensiOpen] = useState(false);
  const [editingPresensiId, setEditingPresensiId] = useState<number | null>(
    null
  );
  const [formPresensi, setFormPresensi] = useState({
    id_karyawan: "",
    tanggal: "",
    jam_masuk: "",
    jam_pulang: "",
    lokasi_masuk: "",
    lokasi_pulang: "",
    total_jam_lembur: "",
    kategori: "",
  });

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const allPresensi: PresensiWithKaryawan[] = tableData.flatMap((karyawan) =>
    (karyawan.presensis || []).map((p) => ({
      ...p,
      karyawan,
    }))
  );

  const filteredPresensi = (
    selectedKaryawan
      ? allPresensi.filter((p) => p.karyawan.nama_lengkap === selectedKaryawan)
      : allPresensi
  ).sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  const totalPages = Math.ceil(filteredPresensi.length / itemsPerPage);
  const paginatedData = filteredPresensi.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const karyawanOptions = [
    { value: null, label: "Semua" },
    ...tableData.map((k) => ({ value: k.nama_lengkap, label: k.nama_lengkap })),
  ];

  const karyawanOptionsUpdate = tableData.map((k) => ({
    value: String(k.id_karyawan), // pastikan value-nya string
    label: k.nama_lengkap,
  }));

  const handleSimpanPresensi = async () => {
    setIsSaving(true);
    try {
      if (editingPresensiId) {
        await updatePresensi(editingPresensiId, formPresensi);
        setAlert({
          variant: "success",
          title: "Presensi Diperbarui",
          message: "Data presensi berhasil diperbarui.",
        });
      } else {
        await storePresensi(formPresensi);
        setAlert({
          variant: "success",
          title: "Presensi Ditambahkan",
          message: "Data presensi berhasil ditambahkan.",
        });
      }

      setIsModalPresensiOpen(false);
      setFormPresensi({
        id_karyawan: "",
        tanggal: "",
        jam_masuk: "",
        jam_pulang: "",
        lokasi_masuk: "",
        lokasi_pulang: "",
        total_jam_lembur: "",
        kategori: "",
      });
      setEditingPresensiId(null);

      const tahunbulan = `${selectedYear}-${selectedMonth}`;
      const data = await fetchAbsensiAll(tahunbulan);
      setTableData(data);
    } catch (error: unknown) {
      console.error("Gagal menyimpan presensi:", error);
      setAlert({
        variant: "error",
        title: "Gagal Menyimpan",
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menyimpan presensi.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    setIsDeleting(true);
    try {
      await destroyPresensi(confirmDeleteId);
      const tahunbulan = `${selectedYear}-${selectedMonth}`;
      const data = await fetchAbsensiAll(tahunbulan);
      setTableData(data);

      setAlert({
        variant: "success",
        title: "Presensi Dihapus",
        message: "Data presensi berhasil dihapus.",
      });
    } catch (error: unknown) {
      console.error("Gagal menghapus presensi:", error);
      setAlert({
        variant: "error",
        title: "Gagal Menghapus",
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menghapus presensi.",
      });
    } finally {
      setIsDeleting(false);
      setConfirmDeleteId(null);
    }
  };

  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {alert && (
        <div className="px-4 pt-4">
          <Alert
            variant={alert.variant}
            title={alert.title}
            message={alert.message}
          />
        </div>
      )}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h3 className="text-lg font-semibold">Data Presensi</h3>
        <button
          onClick={() => {
            setFormPresensi({
              id_karyawan: "",
              tanggal: "",
              jam_masuk: "",
              jam_pulang: "",
              lokasi_masuk: "",
              lokasi_pulang: "",
              total_jam_lembur: "",
              kategori: "",
            });
            setEditingPresensiId(null);
            setIsModalPresensiOpen(true);
          }}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Tambah Presensi
        </button>
      </div>
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
              <TableCell isHeader className="px-4 py-3 font-semibold text-left">
                Aksi
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
                    {kategoriOptions.find((k) => k.value === item.kategori)
                      ?.label ?? item.kategori}
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
                <TableCell className="px-4 py-3 space-x-2">
                  <button
                    onClick={() => {
                      setEditingPresensiId(item.id_absensi);
                      setFormPresensi({
                        id_karyawan: String(item.karyawan.id_karyawan),
                        tanggal: item.tanggal,
                        jam_masuk: item.jam_masuk,
                        jam_pulang: item.jam_pulang,
                        lokasi_masuk: item.lokasi_masuk,
                        lokasi_pulang: item.lokasi_pulang,
                        total_jam_lembur: item.total_jam_lembur,
                        kategori: item.kategori,
                      });
                      setIsModalPresensiOpen(true);
                    }}
                    className="text-yellow-500 hover:text-yellow-600 text-lg"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(item.id_absensi)}
                    className="text-red-600 hover:text-red-700 text-lg"
                    title="Hapus"
                  >
                    🗑️
                  </button>
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

      <Modal
        isOpen={isModalPresensiOpen}
        onClose={() => setIsModalPresensiOpen(false)}
        className="max-w-[700px] m-4"
      >
        <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl">
          <h4 className="mb-4 text-xl font-bold">
            {editingPresensiId ? "Edit Presensi" : "Tambah Presensi"}
          </h4>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Karyawan</Label>
              <Select
                options={karyawanOptionsUpdate}
                value={
                  karyawanOptionsUpdate.find(
                    (opt) => opt.value === formPresensi.id_karyawan
                  ) || null
                }
                onChange={(selected) =>
                  setFormPresensi({
                    ...formPresensi,
                    id_karyawan: selected?.value || "",
                  })
                }
                isSearchable
                placeholder="Pilih Karyawan"
              />
            </div>
            <div>
              <Label>Tanggal</Label>
              <Input
                type="date"
                value={formPresensi.tanggal}
                onChange={(e) =>
                  setFormPresensi({ ...formPresensi, tanggal: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Jam Masuk</Label>
              <Input
                type="time"
                value={formPresensi.jam_masuk}
                onChange={(e) =>
                  setFormPresensi({
                    ...formPresensi,
                    jam_masuk: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Jam Pulang</Label>
              <Input
                type="time"
                value={formPresensi.jam_pulang}
                onChange={(e) =>
                  setFormPresensi({
                    ...formPresensi,
                    jam_pulang: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Lokasi Masuk</Label>
              <Input
                value={formPresensi.lokasi_masuk}
                onChange={(e) =>
                  setFormPresensi({
                    ...formPresensi,
                    lokasi_masuk: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Lokasi Pulang</Label>
              <Input
                value={formPresensi.lokasi_pulang}
                onChange={(e) =>
                  setFormPresensi({
                    ...formPresensi,
                    lokasi_pulang: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Lembur</Label>
              <Input
                type="number"
                value={formPresensi.total_jam_lembur}
                onChange={(e) =>
                  setFormPresensi({
                    ...formPresensi,
                    total_jam_lembur: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label>Kategori</Label>
              <Select
                options={kategoriOptions}
                value={kategoriOptions.find(
                  (opt) => opt.value === formPresensi.kategori
                )}
                onChange={(selected) =>
                  setFormPresensi({
                    ...formPresensi,
                    kategori: selected?.value || "",
                  })
                }
              />
            </div>
          </form>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsModalPresensiOpen(false)}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button onClick={handleSimpanPresensi} disabled={isSaving}>
              {isSaving ? "Menyimpan..." : "Simpan Presensi"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        className="max-w-md m-4"
      >
        <div className="p-6 text-center">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Konfirmasi Hapus
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Apakah Anda yakin ingin menghapus data presensi ini?
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteId(null)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
