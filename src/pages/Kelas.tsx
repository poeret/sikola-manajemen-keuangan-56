import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Plus, Search, Edit, Trash2, Users } from "lucide-react";
import { KelasForm } from "@/components/forms/KelasForm";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const initialKelas = [
  { id: 1, nama: "XII RPL 1", jurusan: "Rekayasa Perangkat Lunak", waliKelas: "Budi Setiawan, S.Kom", jumlahSiswa: 32 },
  { id: 2, nama: "XI TKJ 2", jurusan: "Teknik Komputer Jaringan", waliKelas: "Sari Dewi, S.T", jumlahSiswa: 28 },
  { id: 3, nama: "X MM 1", jurusan: "Multimedia", waliKelas: "Ahmad Fauzi, S.Pd", jumlahSiswa: 30 },
];

export default function Kelas() {
  const [searchQuery, setSearchQuery] = useState("");
  const [kelas, setKelas] = useState(initialKelas);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedKelas, setSelectedKelas] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [kelasToDelete, setKelasToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  const filteredKelas = kelas.filter(item =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.jurusan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.waliKelas.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedKelas(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedKelas(item);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setKelasToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (kelasToDelete) {
      setKelas(prev => prev.filter(item => item.id !== kelasToDelete));
      toast({
        title: "Berhasil",
        description: "Kelas berhasil dihapus"
      });
    }
    setDeleteDialogOpen(false);
    setKelasToDelete(null);
  };

  const handleSubmit = (data: any) => {
    if (formMode === "create") {
      const newKelas = {
        ...data,
        id: Math.max(...kelas.map(k => k.id)) + 1
      };
      setKelas(prev => [...prev, newKelas]);
      toast({
        title: "Berhasil",
        description: "Kelas berhasil ditambahkan"
      });
    } else {
      setKelas(prev => prev.map(item => 
        item.id === selectedKelas?.id ? { ...data, id: selectedKelas.id } : item
      ));
      toast({
        title: "Berhasil",
        description: "Kelas berhasil diperbarui"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Data Kelas</h2>
          <p className="text-muted-foreground">
            Kelola data kelas dan pembagian siswa
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kelas
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Daftar Kelas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari kelas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kelas</TableHead>
                <TableHead>Jurusan</TableHead>
                <TableHead>Wali Kelas</TableHead>
                <TableHead>Jumlah Siswa</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKelas.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.nama}</TableCell>
                  <TableCell>{item.jurusan}</TableCell>
                  <TableCell>{item.waliKelas}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {item.jumlahSiswa}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <KelasForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedKelas}
        mode={formMode}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Hapus Kelas"
        description="Apakah Anda yakin ingin menghapus kelas ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={confirmDelete}
      />
    </div>
  );
}