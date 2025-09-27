import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building, Plus, Search, Edit, Trash2 } from "lucide-react";
import { LembagaForm } from "@/components/forms/LembagaForm";
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

interface LembagaData {
  id: string;
  name: string;
  address: string | null;
  principal: string | null;
  phone: string | null;
  email: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export default function Lembaga() {
  const [searchQuery, setSearchQuery] = useState("");
  const [lembaga, setLembaga] = useState<LembagaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedLembaga, setSelectedLembaga] = useState<LembagaData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lembagaToDelete, setLembagaToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Load data from database
  useEffect(() => {
    loadLembaga();
  }, []);

  const loadLembaga = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading institutions:', error);
        toast({
          title: "Error",
          description: "Gagal memuat data lembaga",
          variant: "destructive"
        });
        return;
      }

      setLembaga(data || []);
    } catch (error) {
      console.error('Error loading institutions:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data lembaga",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredLembaga = lembaga.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.address && item.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.principal && item.principal.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAdd = () => {
    setSelectedLembaga(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (item: LembagaData) => {
    setSelectedLembaga(item);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setLembagaToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (lembagaToDelete) {
      try {
        const { error } = await supabase
          .from('institutions')
          .delete()
          .eq('id', lembagaToDelete);

        if (error) {
          console.error('Error deleting institution:', error);
          toast({
            title: "Error",
            description: "Gagal menghapus lembaga",
            variant: "destructive"
          });
          return;
        }

        setLembaga(prev => prev.filter(item => item.id !== lembagaToDelete));
        toast({
          title: "Berhasil",
          description: "Lembaga berhasil dihapus"
        });
      } catch (error) {
        console.error('Error deleting institution:', error);
        toast({
          title: "Error",
          description: "Gagal menghapus lembaga",
          variant: "destructive"
        });
      }
    }
    setDeleteDialogOpen(false);
    setLembagaToDelete(null);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (formMode === "create") {
        const { data: newInstitution, error } = await supabase
          .from('institutions')
          .insert({
            name: data.nama,
            address: data.alamat,
            principal: data.kepala,
            status: data.status
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating institution:', error);
          toast({
            title: "Error",
            description: "Gagal menambahkan lembaga",
            variant: "destructive"
          });
          return;
        }

        setLembaga(prev => [newInstitution, ...prev]);
        toast({
          title: "Berhasil",
          description: "Lembaga berhasil ditambahkan"
        });
      } else {
        const { data: updatedInstitution, error } = await supabase
          .from('institutions')
          .update({
            name: data.nama,
            address: data.alamat,
            principal: data.kepala,
            status: data.status
          })
          .eq('id', selectedLembaga?.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating institution:', error);
          toast({
            title: "Error",
            description: "Gagal memperbarui lembaga",
            variant: "destructive"
          });
          return;
        }

        setLembaga(prev => prev.map(item => 
          item.id === selectedLembaga?.id ? updatedInstitution : item
        ));
        toast({
          title: "Berhasil",
          description: "Lembaga berhasil diperbarui"
        });
      }
    } catch (error) {
      console.error('Error saving institution:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan lembaga",
        variant: "destructive"
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : filteredLembaga.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Tidak ada data lembaga
                  </TableCell>
                </TableRow>
              ) : (
                filteredLembaga.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.address || "-"}</TableCell>
                    <TableCell>{item.principal || "-"}</TableCell>
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

      <LembagaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedLembaga ? {
          id: selectedLembaga.id,
          nama: selectedLembaga.name,
          alamat: selectedLembaga.address || "",
          kepala: selectedLembaga.principal || "",
          status: selectedLembaga.status || "Aktif"
        } : undefined}
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