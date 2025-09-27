import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, Search, Edit, Trash2, Shield, Eye } from "lucide-react";
import { PenggunaForm } from "@/components/forms/PenggunaForm";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PenggunaData {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export default function ManajemenPengguna() {
  const [searchQuery, setSearchQuery] = useState("");
  const [pengguna, setPengguna] = useState<PenggunaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedPengguna, setSelectedPengguna] = useState<PenggunaData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [penggunaToDelete, setPenggunaToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Load data from database
  useEffect(() => {
    loadPengguna();
  }, []);

  const loadPengguna = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading users:', error);
        toast({
          title: "Error",
          description: "Gagal memuat data pengguna",
          variant: "destructive"
        });
        return;
      }

      setPengguna(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data pengguna",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPengguna = pengguna.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedPengguna(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (item: PenggunaData) => {
    setSelectedPengguna(item);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setPenggunaToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (penggunaToDelete) {
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', penggunaToDelete);

        if (error) {
          console.error('Error deleting user:', error);
          toast({
            title: "Error",
            description: "Gagal menghapus pengguna",
            variant: "destructive"
          });
          return;
        }

        setPengguna(prev => prev.filter(item => item.id !== penggunaToDelete));
        toast({
          title: "Berhasil",
          description: "Pengguna berhasil dihapus"
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Error",
          description: "Gagal menghapus pengguna",
          variant: "destructive"
        });
      }
    }
    setDeleteDialogOpen(false);
    setPenggunaToDelete(null);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (formMode === "create") {
        const { data: newUser, error } = await supabase
          .from('profiles')
          .insert([{
            name: data.name,
            email: data.email,
            role: data.role,
            is_active: data.status === 'Aktif',
            user_id: crypto.randomUUID() // Generate a UUID for user_id
          }])
          .select()
          .single();

        if (error) {
          console.error('Error creating user:', error);
          toast({
            title: "Error",
            description: "Gagal menambahkan pengguna",
            variant: "destructive"
          });
          return;
        }

        setPengguna(prev => [...prev, newUser]);
        toast({
          title: "Berhasil",
          description: "Pengguna berhasil ditambahkan"
        });
      } else {
        const { error } = await supabase
          .from('profiles')
          .update({
            name: data.name,
            email: data.email,
            role: data.role,
            is_active: data.status === 'Aktif'
          })
          .eq('id', selectedPengguna?.id);

        if (error) {
          console.error('Error updating user:', error);
          toast({
            title: "Error",
            description: "Gagal memperbarui pengguna",
            variant: "destructive"
          });
          return;
        }

        setPengguna(prev => prev.map(item => 
          item.id === selectedPengguna?.id ? { ...item, ...data, is_active: data.status === 'Aktif' } : item
        ));
        toast({
          title: "Berhasil",
          description: "Pengguna berhasil diperbarui"
        });
      }
    } catch (error) {
      console.error('Error submitting user:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan pengguna",
        variant: "destructive"
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-destructive/10 text-destructive";
      case "admin":
        return "bg-blue-100 text-blue-800";
      case "cashier":
        return "bg-primary/10 text-primary";
      case "teacher":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Super Admin";
      case "admin":
        return "Admin";
      case "cashier":
        return "Kasir";
      case "teacher":
        return "Guru";
      default:
        return role;
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
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPengguna.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getRoleColor(item.role)}`}>
                      <Shield className="mr-1 h-3 w-3" />
                      {getRoleDisplayName(item.role)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      item.is_active ? 'bg-success/10 text-success' : 'bg-muted/10 text-muted-foreground'
                    }`}>
                      {item.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A"}
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

      <PenggunaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedPengguna ? {
          ...selectedPengguna,
          status: selectedPengguna.is_active ? "Aktif" : "Nonaktif"
        } : undefined}
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