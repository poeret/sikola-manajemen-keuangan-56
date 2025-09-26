import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building, Plus, Search, Edit, Trash2 } from "lucide-react";
import { LembagaForm } from "@/components/forms/LembagaForm";
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

const initialLembaga = [
  { id: 1, nama: "SMK Negeri 1 Jakarta", alamat: "Jl. Pendidikan No. 123", kepala: "Dr. Soekarno, M.Pd", status: "Aktif" },
  { id: 2, nama: "SMP Negeri 2 Jakarta", alamat: "Jl. Belajar No. 456", kepala: "Ir. Hatta, S.Pd", status: "Aktif" },
];

export default function Lembaga() {
  const [searchQuery, setSearchQuery] = useState("");
  const [lembaga, setLembaga] = useState(initialLembaga);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedLembaga, setSelectedLembaga] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lembagaToDelete, setLembagaToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  const filteredLembaga = lembaga.filter(item =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.alamat.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kepala.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedLembaga(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedLembaga(item);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setLembagaToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (lembagaToDelete) {
      setLembaga(prev => prev.filter(item => item.id !== lembagaToDelete));
      toast({
        title: "Berhasil",
        description: "Lembaga berhasil dihapus"
      });
    }
    setDeleteDialogOpen(false);
    setLembagaToDelete(null);
  };

  const handleSubmit = (data: any) => {
    if (formMode === "create") {
      const newLembaga = {
        ...data,
        id: Math.max(...lembaga.map(l => l.id)) + 1
      };
      setLembaga(prev => [...prev, newLembaga]);
      toast({
        title: "Berhasil",
        description: "Lembaga berhasil ditambahkan"
      });
    } else {
      setLembaga(prev => prev.map(item => 
        item.id === selectedLembaga?.id ? { ...data, id: selectedLembaga.id } : item
      ));
      toast({
        title: "Berhasil",
        description: "Lembaga berhasil diperbarui"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Data Lembaga</h2>
          <p className="text-muted-foreground">
            Kelola data lembaga pendidikan dalam sistem
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Lembaga
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Daftar Lembaga
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari lembaga..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Lembaga</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Kepala Sekolah</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLembaga.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.nama}</TableCell>
                  <TableCell>{item.alamat}</TableCell>
                  <TableCell>{item.kepala}</TableCell>
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

      <LembagaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedLembaga}
        mode={formMode}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Hapus Lembaga"
        description="Apakah Anda yakin ingin menghapus lembaga ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={confirmDelete}
      />
    </div>
  );
}