import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Award, Plus, Search, Edit, Trash2, Percent } from "lucide-react";
import { BeasiswaForm } from "@/components/forms/BeasiswaForm";
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

const initialBeasiswa = [
  { id: 1, nama: "Beasiswa Prestasi", deskripsi: "Untuk siswa berprestasi akademik", persentasePotongan: 50, status: "Aktif" },
  { id: 2, nama: "Beasiswa Kurang Mampu", deskripsi: "Bantuan untuk siswa tidak mampu", persentasePotongan: 75, status: "Aktif" },
  { id: 3, nama: "Beasiswa Yatim Piatu", deskripsi: "Khusus untuk anak yatim piatu", persentasePotongan: 100, status: "Aktif" },
];

export default function KategoriBeasiswa() {
  const [searchQuery, setSearchQuery] = useState("");
  const [beasiswa, setBeasiswa] = useState(initialBeasiswa);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedBeasiswa, setSelectedBeasiswa] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [beasiswaToDelete, setBeasiswaToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  const filteredBeasiswa = beasiswa.filter(item =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedBeasiswa(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedBeasiswa(item);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setBeasiswaToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (beasiswaToDelete) {
      setBeasiswa(prev => prev.filter(item => item.id !== beasiswaToDelete));
      toast({
        title: "Berhasil",
        description: "Kategori beasiswa berhasil dihapus"
      });
    }
    setDeleteDialogOpen(false);
    setBeasiswaToDelete(null);
  };

  const handleSubmit = (data: any) => {
    if (formMode === "create") {
      const newBeasiswa = {
        ...data,
        id: Math.max(...beasiswa.map(b => b.id)) + 1
      };
      setBeasiswa(prev => [...prev, newBeasiswa]);
      toast({
        title: "Berhasil",
        description: "Kategori beasiswa berhasil ditambahkan"
      });
    } else {
      setBeasiswa(prev => prev.map(item => 
        item.id === selectedBeasiswa?.id ? { ...data, id: selectedBeasiswa.id } : item
      ));
      toast({
        title: "Berhasil",
        description: "Kategori beasiswa berhasil diperbarui"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kategori Beasiswa</h2>
          <p className="text-muted-foreground">
            Kelola jenis beasiswa dan kriteria penerima
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kategori
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Daftar Kategori Beasiswa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari kategori beasiswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kategori</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Potongan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBeasiswa.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.nama}</TableCell>
                  <TableCell>{item.deskripsi}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-muted-foreground" />
                      {item.persentasePotongan}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-success/10 text-success">
                      {item.status}
                    </span>
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

      <BeasiswaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedBeasiswa}
        mode={formMode}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Hapus Kategori Beasiswa"
        description="Apakah Anda yakin ingin menghapus kategori beasiswa ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={confirmDelete}
      />
    </div>
  );
}