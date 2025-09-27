import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Plus, Search, Edit, Trash2, Users } from "lucide-react";
import { KelasForm } from "@/components/forms/KelasForm";
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

interface KelasData {
  id: string;
  name: string;
  level: number;
  academic_year_id: string | null;
  homeroom_teacher: string | null;
  capacity: number | null;
  current_students: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export default function Kelas() {
  const [searchQuery, setSearchQuery] = useState("");
  const [kelas, setKelas] = useState<KelasData[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedKelas, setSelectedKelas] = useState<KelasData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [kelasToDelete, setKelasToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Load data from database
  useEffect(() => {
    loadKelas();
  }, []);

  const loadKelas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading classes:', error);
        toast({
          title: "Error",
          description: "Gagal memuat data kelas",
          variant: "destructive"
        });
        return;
      }

      setKelas(data || []);
    } catch (error) {
      console.error('Error loading classes:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data kelas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredKelas = kelas.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.homeroom_teacher && item.homeroom_teacher.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAdd = () => {
    setSelectedKelas(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (item: KelasData) => {
    setSelectedKelas(item);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setKelasToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (kelasToDelete) {
      try {
        const { error } = await supabase
          .from('classes')
          .delete()
          .eq('id', kelasToDelete);

        if (error) {
          console.error('Error deleting class:', error);
          toast({
            title: "Error",
            description: "Gagal menghapus kelas",
            variant: "destructive"
          });
          return;
        }

        setKelas(prev => prev.filter(item => item.id !== kelasToDelete));
        toast({
          title: "Berhasil",
          description: "Kelas berhasil dihapus"
        });
      } catch (error) {
        console.error('Error deleting class:', error);
        toast({
          title: "Error",
          description: "Gagal menghapus kelas",
          variant: "destructive"
        });
      }
    }
    setDeleteDialogOpen(false);
    setKelasToDelete(null);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (formMode === "create") {
        const { data: newClass, error } = await supabase
          .from('classes')
          .insert({
            name: data.nama,
            level: data.level,
            homeroom_teacher: data.waliKelas,
            capacity: data.kapasitas
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating class:', error);
          toast({
            title: "Error",
            description: "Gagal menambahkan kelas",
            variant: "destructive"
          });
          return;
        }

        setKelas(prev => [newClass, ...prev]);
        toast({
          title: "Berhasil",
          description: "Kelas berhasil ditambahkan"
        });
      } else {
        const { data: updatedClass, error } = await supabase
          .from('classes')
          .update({
            name: data.nama,
            level: data.level,
            homeroom_teacher: data.waliKelas,
            capacity: data.kapasitas
          })
          .eq('id', selectedKelas?.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating class:', error);
          toast({
            title: "Error",
            description: "Gagal memperbarui kelas",
            variant: "destructive"
          });
          return;
        }

        setKelas(prev => prev.map(item => 
          item.id === selectedKelas?.id ? updatedClass : item
        ));
        toast({
          title: "Berhasil",
          description: "Kelas berhasil diperbarui"
        });
      }
    } catch (error) {
      console.error('Error saving class:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan kelas",
        variant: "destructive"
      });
    }
    setFormOpen(false);
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : filteredKelas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Tidak ada data kelas
                  </TableCell>
                </TableRow>
              ) : (
                filteredKelas.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>Level {item.level}</TableCell>
                    <TableCell>{item.homeroom_teacher || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {item.current_students || 0} / {item.capacity || 0}
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <KelasForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedKelas ? {
          id: selectedKelas.id,
          nama: selectedKelas.name,
          level: selectedKelas.level,
          waliKelas: selectedKelas.homeroom_teacher || "",
          kapasitas: selectedKelas.capacity || 0
        } : undefined}
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