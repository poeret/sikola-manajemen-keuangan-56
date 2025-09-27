import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Award, Plus, Search, Edit, Trash2, Percent } from "lucide-react";
import { BeasiswaForm } from "@/components/forms/BeasiswaForm";
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

interface BeasiswaData {
  id: string;
  name: string;
  description: string | null;
  amount: number | null;
  criteria: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export default function KategoriBeasiswa() {
  const [searchQuery, setSearchQuery] = useState("");
  const [beasiswa, setBeasiswa] = useState<BeasiswaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedBeasiswa, setSelectedBeasiswa] = useState<BeasiswaData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [beasiswaToDelete, setBeasiswaToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Load data from database
  useEffect(() => {
    loadBeasiswa();
  }, []);

  const loadBeasiswa = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('scholarship_categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading scholarship categories:', error);
        toast({
          title: "Error",
          description: "Gagal memuat data kategori beasiswa",
          variant: "destructive"
        });
        return;
      }

      setBeasiswa(data || []);
    } catch (error) {
      console.error('Error loading scholarship categories:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data kategori beasiswa",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredBeasiswa = beasiswa.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAdd = () => {
    setSelectedBeasiswa(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (item: BeasiswaData) => {
    setSelectedBeasiswa(item);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setBeasiswaToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (beasiswaToDelete) {
      try {
        const { error } = await supabase
          .from('scholarship_categories')
          .delete()
          .eq('id', beasiswaToDelete);

        if (error) {
          console.error('Error deleting scholarship category:', error);
          toast({
            title: "Error",
            description: "Gagal menghapus kategori beasiswa",
            variant: "destructive"
          });
          return;
        }

        setBeasiswa(prev => prev.filter(item => item.id !== beasiswaToDelete));
        toast({
          title: "Berhasil",
          description: "Kategori beasiswa berhasil dihapus"
        });
      } catch (error) {
        console.error('Error deleting scholarship category:', error);
        toast({
          title: "Error",
          description: "Gagal menghapus kategori beasiswa",
          variant: "destructive"
        });
      }
    }
    setDeleteDialogOpen(false);
    setBeasiswaToDelete(null);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (formMode === "create") {
        const { data: newScholarship, error } = await supabase
          .from('scholarship_categories')
          .insert({
            name: data.nama,
            description: data.deskripsi,
            amount: data.persentasePotongan,
            criteria: "",
            status: "active"
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating scholarship category:', error);
          toast({
            title: "Error",
            description: "Gagal menambahkan kategori beasiswa",
            variant: "destructive"
          });
          return;
        }

        setBeasiswa(prev => [newScholarship, ...prev]);
        toast({
          title: "Berhasil",
          description: "Kategori beasiswa berhasil ditambahkan"
        });
      } else {
        const { data: updatedScholarship, error } = await supabase
          .from('scholarship_categories')
          .update({
            name: data.nama,
            description: data.deskripsi,
            amount: data.persentasePotongan,
            criteria: "",
            status: data.status
          })
          .eq('id', selectedBeasiswa?.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating scholarship category:', error);
          toast({
            title: "Error",
            description: "Gagal memperbarui kategori beasiswa",
            variant: "destructive"
          });
          return;
        }

        setBeasiswa(prev => prev.map(item => 
          item.id === selectedBeasiswa?.id ? updatedScholarship : item
        ));
        toast({
          title: "Berhasil",
          description: "Kategori beasiswa berhasil diperbarui"
        });
      }
    } catch (error) {
      console.error('Error saving scholarship category:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan kategori beasiswa",
        variant: "destructive"
      });
    }
    setFormOpen(false);
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : filteredBeasiswa.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Tidak ada data kategori beasiswa
                  </TableCell>
                </TableRow>
              ) : (
                filteredBeasiswa.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.description || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                        {item.amount ? `Rp ${item.amount.toLocaleString('id-ID')}` : "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-success/10 text-success">
                        {item.status || "Aktif"}
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <BeasiswaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedBeasiswa ? {
          id: selectedBeasiswa.id,
          nama: selectedBeasiswa.name,
          deskripsi: selectedBeasiswa.description || "",
          persentasePotongan: selectedBeasiswa.amount || 0,
          status: selectedBeasiswa.status || "active"
        } : undefined}
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