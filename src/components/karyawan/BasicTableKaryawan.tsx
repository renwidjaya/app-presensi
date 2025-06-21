import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Label from "../form/Label";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { editUserForm, fetchKaryawanList, registerUser } from "../../api";

type RoleType = "ADMIN" | "KARYAWAN";

interface Karyawan {
  id: number;
  name: string;
  jabatan: string;
  nip: string;
  image: string;
  email?: string;
  password?: string;
  role?: RoleType;
  alamat_lengkap?: string;
}

export default function BasicTableKaryawan() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<Karyawan[]>([]);
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
    alamat_lengkap: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    loadKaryawan();
  }, []);

  const loadKaryawan = async () => {
    try {
      const res = await fetchKaryawanList();
      const mappedData: Karyawan[] = res.data.map((item: any) => ({
        id: item.id_user,
        name: item.nama_lengkap,
        jabatan: item.jabatan,
        nip: item.nip,
        image: `/uploads/${item.image_profil}`,
        email: item.user?.email || "",
        role: item.user?.role || "KARYAWAN",
        alamat_lengkap: item.alamat_lengkap,
      }));
      setData(mappedData);
    } catch (error) {
      console.error("Gagal mengambil data karyawan", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        nama: form.name,
        email: form.email || "",
        password: form.password || "",
        role: form.role || "KARYAWAN",
        nip: form.nip,
        jabatan: form.jabatan,
        alamat_lengkap: form.alamat_lengkap || "",
        imageFile: imageFile || undefined,
      };

      if (editingId !== null) {
        await editUserForm({ ...payload, id_user: editingId });
      } else {
        await registerUser(payload);
      }

      setIsOpen(false);
      setEditingId(null);
      loadKaryawan();
    } catch (err) {
      console.error("Gagal simpan karyawan", err);
    }
  };

  const handleEdit = (karyawan: Karyawan) => {
    setForm({
      ...form,
      ...karyawan,
      password: "",
    });
    setEditingId(karyawan.id);
    setIsOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileURL = URL.createObjectURL(file);
      setForm({ ...form, image: fileURL });
      setImageFile(file);
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
              alamat_lengkap: "",
            });
            setImageFile(null);
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
              <TableCell
                isHeader
                className="px-4 py-3 font-semibold text-center"
              >
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
                Aksi
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((karyawan) => (
              <TableRow key={karyawan.id} className="align-middle">
                <TableCell className="text-center">
                  <div className="flex justify-center items-center">
                    <img
                      src={karyawan.image}
                      alt={karyawan.name}
                      onError={(e) =>
                        (e.currentTarget.src = "/images/default.jpg")
                      }
                      className="w-12 h-12 rounded-full object-cover border m-2"
                    />
                  </div>
                </TableCell>
                <TableCell>{karyawan.name}</TableCell>
                <TableCell>{karyawan.jabatan}</TableCell>
                <TableCell>{karyawan.nip}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-white rounded"
                    onClick={() => handleEdit(karyawan)}
                  >
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
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        role: e.target.value as RoleType,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="KARYAWAN">KARYAWAN</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
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
                      onError={(e) =>
                        (e.currentTarget.src = "/images/default.jpg")
                      }
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
