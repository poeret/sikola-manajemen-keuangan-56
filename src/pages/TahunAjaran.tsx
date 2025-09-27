import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { TahunAjaranForm } from "@/components/forms/TahunAjaranForm";
import { supabase } from "@/integrations/supabase/client";

interface TahunAjaranData {
  id: string;
  code: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export default function TahunAjaran() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tahunAjaran, setTahunAjaran] = useState<TahunAjaranData[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState<TahunAjaranData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tahunAjaranToDelete, setTahunAjaranToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Load data from database
  useEffect(() => {
    loadTahunAjaran();
  }, []);

  const loadTahunAjaran = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('academic_years')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading academic years:', error);
        toast({
          title: "Error",
          description: "Gagal memuat data tahun ajaran",
          variant: "destructive"
        });
        return;
      }

      setTahunAjaran(data || []);
    } catch (error) {
      console.error('Error loading academic years:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data tahun ajaran",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const filteredData = tahunAjaran.filter(item => 
    item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedTahunAjaran(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (item: TahunAjaranData) => {
    setSelectedTahunAjaran(item);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setTahunAjaranToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (tahunAjaranToDelete) {
      try {
        const { error } = await supabase
          .from('academic_years')
          .delete()
          .eq('id', tahunAjaranToDelete);

        if (error) {
          console.error('Error deleting academic year:', error);
          toast({
            title: "Error",
            description: "Gagal menghapus tahun ajaran",
            variant: "destructive"
          });
          return;
        }

        setTahunAjaran(prev => prev.filter(item => item.id !== tahunAjaranToDelete));
        toast({
          title: "Berhasil",
          description: "Tahun ajaran berhasil dihapus"
        });
      } catch (error) {
        console.error('Error deleting academic year:', error);
        toast({
          title: "Error",
          description: "Gagal menghapus tahun ajaran",
          variant: "destructive"
        });
      }
    }
    setDeleteDialogOpen(false);
    setTahunAjaranToDelete(null);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (formMode === "create") {
        const { data: newAcademicYear, error } = await supabase
          .from('academic_years')
          .insert({
            code: data.kode,
            description: data.deskripsi,
            start_date: data.tanggalMulai,
            end_date: data.tanggalSelesai,
            is_active: data.status === "Aktif"
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating academic year:', error);
          toast({
            title: "Error",
            description: "Gagal menambahkan tahun ajaran",
            variant: "destructive"
          });
          return;
        }

        setTahunAjaran(prev => [newAcademicYear, ...prev]);
        toast({
          title: "Berhasil",
          description: "Tahun ajaran berhasil ditambahkan"
        });
      } else {
        const { data: updatedAcademicYear, error } = await supabase
          .from('academic_years')
          .update({
            code: data.kode,
            description: data.deskripsi,
            start_date: data.tanggalMulai,
            end_date: data.tanggalSelesai,
            is_active: data.status === "Aktif"
          })
          .eq('id', selectedTahunAjaran?.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating academic year:', error);
          toast({
            title: "Error",
            description: "Gagal memperbarui tahun ajaran",
            variant: "destructive"
          });
          return;
        }

        setTahunAjaran(prev => prev.map(item => 
          item.id === selectedTahunAjaran?.id ? updatedAcademicYear : item
        ));
        toast({
          title: "Berhasil",
          description: "Tahun ajaran berhasil diperbarui"
        });
      }
    } catch (error) {
      console.error('Error saving academic year:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan tahun ajaran",
        variant: "destructive"
      });
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Master Tahun Ajaran</h2>
          <p className="text-muted-foreground">
            Kelola data tahun ajaran sekolah
          </p>
        </div>
        
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pencarian Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan kode atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Tahun Ajaran</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Deskripsi Tahun Ajaran</TableHead>
                <TableHead>Tanggal Mulai</TableHead>
                <TableHead>Tanggal Selesai</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Tidak ada data tahun ajaran
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{new Date(item.start_date).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>{new Date(item.end_date).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>
                      <Badge variant={item.is_active ? "default" : "secondary"}>
                        {item.is_active ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
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

      {/* Form Dialog */}
      <TahunAjaranForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedTahunAjaran ? {
          id: selectedTahunAjaran.id,
          kode: selectedTahunAjaran.code,
          deskripsi: selectedTahunAjaran.description,
          tanggalMulai: selectedTahunAjaran.start_date,
          tanggalSelesai: selectedTahunAjaran.end_date,
          status: selectedTahunAjaran.is_active ? "Aktif" : "Tidak Aktif"
        } : undefined}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus"
        description="Apakah Anda yakin ingin menghapus tahun ajaran ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
}