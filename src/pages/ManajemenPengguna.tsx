import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, Search, Edit, Trash2, Shield, Eye } from "lucide-react";
import { PenggunaForm } from "@/components/forms/PenggunaForm";
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

const initialPengguna = [
  { id: 1, nama: "Super Admin", email: "admin@sekolah.sch.id", role: "Super Admin", status: "Aktif", lastLogin: "2024-01-15 10:30" },
  { id: 2, nama: "Kasir 1", email: "kasir1@sekolah.sch.id", role: "Kasir", status: "Aktif", lastLogin: "2024-01-15 09:15" },
  { id: 3, nama: "Kasir 2", email: "kasir2@sekolah.sch.id", role: "Kasir", status: "Nonaktif", lastLogin: "2024-01-10 14:20" },
];

export default function ManajemenPengguna() {
  const [searchQuery, setSearchQuery] = useState("");
  const [pengguna, setPengguna] = useState(initialPengguna);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedPengguna, setSelectedPengguna] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [penggunaToDelete, setPenggunaToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  const filteredPengguna = pengguna.filter(item =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedPengguna(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedPengguna(item);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setPenggunaToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (penggunaToDelete) {
      setPengguna(prev => prev.filter(item => item.id !== penggunaToDelete));
      toast({
        title: "Berhasil",
        description: "Pengguna berhasil dihapus"
      });
    }
    setDeleteDialogOpen(false);
    setPenggunaToDelete(null);
  };

  const handleSubmit = (data: any) => {
    if (formMode === "create") {
      const newPengguna = {
        ...data,
        id: Math.max(...pengguna.map(p => p.id)) + 1,
        lastLogin: "Belum pernah login"
      };
      setPengguna(prev => [...prev, newPengguna]);
      toast({
        title: "Berhasil",
        description: "Pengguna berhasil ditambahkan"
      });
    } else {
      setPengguna(prev => prev.map(item => 
        item.id === selectedPengguna?.id ? { ...data, id: selectedPengguna.id, lastLogin: selectedPengguna.lastLogin } : item
      ));
      toast({
        title: "Berhasil",
        description: "Pengguna berhasil diperbarui"
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-destructive/10 text-destructive";
      case "Kasir":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h2>
          <p className="text-muted-foreground">
            Kelola akses pengguna dan hak akses sistem
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Pengguna
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Daftar Pengguna
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari pengguna..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Login Terakhir</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPengguna.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.nama}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getRoleColor(item.role)}`}>
                      <Shield className="mr-1 h-3 w-3" />
                      {item.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      item.status === 'Aktif' ? 'bg-success/10 text-success' : 'bg-muted/10 text-muted-foreground'
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.lastLogin}</TableCell>
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

      <PenggunaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedPengguna}
        mode={formMode}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Hapus Pengguna"
        description="Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={confirmDelete}
      />
    </div>
  );
}