import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Label from "../form/Label";
import { Modal } from "../ui/modal";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";

interface Karyawan {
  id: number;
  name: string;
  jabatan: string;
  nip: string;
  image: string;
  status: "Aktif" | "Nonaktif";
  email?: string;
  password?: string;
  role?: string;
  alamat_lengkap?: string;
}

export default function BasicTableKaryawan() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<Karyawan[]>([
    {
      id: 1,
      name: "Rendi Widjaya",
      jabatan: "Fullstack Developer",
      nip: "199201012021011001",
      image: "/images/user/user-17.jpg",
      status: "Aktif",
    },
    {
      id: 2,
      name: "Indrawan S.Kom",
      jabatan: "Frontend Developer",
      nip: "199201012021011002",
      image: "/images/user/user-18.jpg",
      status: "Aktif",
    },
    {
      id: 3,
      name: "Suparman S.Kom",
      jabatan: "Backend Developer",
      nip: "199201012021011003",
      image: "/images/user/user-19.jpg",
      status: "Aktif",
    },
  ]);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Karyawan>({
    id: 0,
    name: "",
    email: "",
    password: "",
    role: "KARYAWAN",
    jabatan: "",
    nip: "",
    image: "",
    status: "Aktif",
    alamat_lengkap: "",
  });

  const handleSubmit = () => {
    if (editingId !== null) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...form, id: editingId } : item
        )
      );
    } else {
      setData((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    setIsOpen(false);
    setEditingId(null);
  };

  const handleEdit = (karyawan: Karyawan) => {
    setForm(karyawan);
    setEditingId(karyawan.id);
    setIsOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileURL = URL.createObjectURL(e.target.files[0]);
      setForm({ ...form, image: fileURL });
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h3 className="text-lg font-semibold">Data Karyawan</h3>
        <button
          onClick={() => {
            setForm({
              id: 0,
              name: "",
              email: "",
              password: "",
              role: "KARYAWAN",
              jabatan: "",
              nip: "",
              image: "",
              status: "Aktif",
              alamat_lengkap: "",
            });
            setEditingId(null);
            setIsOpen(true);
          }}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Tambah Karyawan
        </button>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader className="px-4 py-3 font-semibold text-left">
                Foto
              </TableCell>
              <TableCell isHeader className="px-4 py-3 font-semibold text-left">
                Nama Lengkap
              </TableCell>
              <TableCell isHeader className="px-4 py-3 font-semibold text-left">
                Jabatan
              </TableCell>
              <TableCell isHeader className="px-4 py-3 font-semibold text-left">
                NIP
              </TableCell>
              <TableCell isHeader className="px-4 py-3 font-semibold text-left">
                Status
              </TableCell>
              <TableCell isHeader className="px-4 py-3 font-semibold text-left">
                Aksi
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.map((karyawan) => (
              <TableRow key={karyawan.id}>
                <TableCell className="px-4 py-3">
                  <img
                    src={karyawan.image}
                    alt={karyawan.name}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                </TableCell>
                <TableCell className="px-4 py-3">{karyawan.name}</TableCell>
                <TableCell className="px-4 py-3">{karyawan.jabatan}</TableCell>
                <TableCell className="px-4 py-3">{karyawan.nip}</TableCell>
                <TableCell className="px-4 py-3">
                  <Badge
                    color={karyawan.status === "Aktif" ? "success" : "error"}
                    size="sm"
                  >
                    {karyawan.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <Button size="sm" onClick={() => handleEdit(karyawan)}>
                    Edit
                  </Button>
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
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="max-w-[700px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {editingId ? "Edit Karyawan" : "Tambah Karyawan"}
          </h4>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <Label>Nama Lengkap</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Jabatan</Label>
                  <Input
                    value={form.jabatan}
                    onChange={(e) =>
                      setForm({ ...form, jabatan: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Email</Label>
                  <Input
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Role</Label>
                  <Input
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>NIP</Label>
                  <Input
                    value={form.nip}
                    onChange={(e) => setForm({ ...form, nip: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Alamat Lengkap</Label>
                  <Input
                    value={form.alamat_lengkap}
                    onChange={(e) =>
                      setForm({ ...form, alamat_lengkap: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label>Upload Foto Profil</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {form.image && (
                    <img
                      src={form.image}
                      alt="preview"
                      className="mt-2 w-20 h-20 object-cover rounded"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
              <Button size="sm" onClick={handleSubmit}>
                Simpan
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
