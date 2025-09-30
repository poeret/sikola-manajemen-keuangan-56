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
import { Plus, Search, Edit, Trash2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { SiswaForm } from "@/components/forms/SiswaForm";
import { supabase } from "@/integrations/supabase/client";

interface SiswaData {
  id: string;
  nis: string;
  name: string;
  gender: string | null;
  birth_date: string | null;
  birth_place: string | null;
  address: string | null;
  phone: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  class_id: string | null;
  // Related class data (joined from classes table)
  classes?: {
    name?: string | null;
    level?: number | null;
    institutions?: { name?: string | null } | string | null;
  } | null;
  status: string | null;
  admission_date: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export default function DataSiswa() {
  const [searchQuery, setSearchQuery] = useState("");
  const [siswa, setSiswa] = useState<SiswaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedSiswa, setSelectedSiswa] = useState<SiswaData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [siswaToDelete, setSiswaToDelete] = useState<string | null>(null);
  const [institutions, setInstitutions] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string>("all");
  const { toast } = useToast();

  // Load data from database
  useEffect(() => {
    loadSiswa();
    loadInstitutions();
  }, []);

  const loadSiswa = async () => {
    try {
      setLoading(true);
      // First, fetch students with class basic info
      const { data, error } = await supabase
        .from('students')
        .select('*, classes(name, level, institution_id)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading students:', error);
        toast({
          title: "Error",
          description: "Gagal memuat data siswa",
          variant: "destructive"
        });
        return;
      }

      // Resolve institution names in a separate query to avoid nested join issues
      const institutionIds = Array.from(new Set(
        (data || [])
          .map((s: any) => s.classes?.institution_id)
          .filter((id: any) => !!id)
      ));

      let institutionsById: Record<string, { name: string }>= {};
      if (institutionIds.length > 0) {
        const { data: institutions } = await supabase
          .from('institutions')
          .select('id, name')
          .in('id', institutionIds as string[]);
        institutionsById = Object.fromEntries((institutions || []).map((i: any) => [i.id, { name: i.name }]));
      }

      const enriched = (data || []).map((s: any) => ({
        ...s,
        classes: s.classes
          ? { ...s.classes, institutions: s.classes.institution_id ? institutionsById[s.classes.institution_id] || null : null }
          : null
      }));

      setSiswa(enriched as any);
    } catch (error) {
      console.error('Error loading students:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data siswa",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadInstitutions = async () => {
    try {
      const { data, error } = await supabase
        .from('institutions')
        .select('id, name')
        .order('name', { ascending: true });
      if (!error) setInstitutions(data || []);
    } catch {}
  };
  
  const filteredData = siswa.filter(item => {
    const q = searchQuery.toLowerCase();
    const className = (item.classes?.name || '').toLowerCase();
    const institutionName = (typeof item.classes?.institutions === 'object'
      ? (item.classes?.institutions?.name || '')
      : '').toLowerCase();
    const matchesText = (
      item.nis.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      className.includes(q) ||
      institutionName.includes(q)
    );
    const matchesInstitution = selectedInstitution === 'all' || (item as any)?.classes?.institution_id === selectedInstitution;
    return matchesText && matchesInstitution;
  });

  const handleAdd = () => {
    setSelectedSiswa(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (item: SiswaData) => {
    setSelectedSiswa(item);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setSiswaToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (siswaToDelete) {
      try {
        const { error } = await supabase
          .from('students')
          .delete()
          .eq('id', siswaToDelete);

        if (error) {
          console.error('Error deleting student:', error);
          toast({
            title: "Error",
            description: "Gagal menghapus siswa",
            variant: "destructive"
          });
          return;
        }

        setSiswa(prev => prev.filter(item => item.id !== siswaToDelete));
        toast({
          title: "Berhasil",
          description: "Siswa berhasil dihapus"
        });
      } catch (error) {
        console.error('Error deleting student:', error);
        toast({
          title: "Error",
          description: "Gagal menghapus siswa",
          variant: "destructive"
        });
      }
    }
    setDeleteDialogOpen(false);
    setSiswaToDelete(null);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (formMode === "create") {
        const { data: newStudent, error } = await supabase
          .from('students')
          .insert({
            nis: data.nis,
            name: data.nama,
            gender: data.jenisKelamin,
            birth_date: data.tanggalLahir,
            birth_place: data.tempatLahir,
            address: data.alamat,
            phone: data.telepon,
            parent_name: data.namaOrtu,
            parent_phone: data.teleponOrtu,
            status: data.status,
            class_id: data.classId || null
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating student:', error);
          toast({
            title: "Error",
            description: "Gagal menambahkan siswa",
            variant: "destructive"
          });
          return;
        }

        setSiswa(prev => [newStudent, ...prev]);
        toast({
          title: "Berhasil",
          description: "Siswa berhasil ditambahkan"
        });
      } else {
        const { data: updatedStudent, error } = await supabase
          .from('students')
          .update({
            nis: data.nis,
            name: data.nama,
            gender: data.jenisKelamin,
            birth_date: data.tanggalLahir,
            birth_place: data.tempatLahir,
            address: data.alamat,
            phone: data.telepon,
            parent_name: data.namaOrtu,
            parent_phone: data.teleponOrtu,
            status: data.status,
            class_id: data.classId || null
          })
          .eq('id', selectedSiswa?.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating student:', error);
          toast({
            title: "Error",
            description: "Gagal memperbarui siswa",
            variant: "destructive"
          });
          return;
        }

        setSiswa(prev => prev.map(item => 
          item.id === selectedSiswa?.id ? updatedStudent : item
        ));
        toast({
          title: "Berhasil",
          description: "Siswa berhasil diperbarui"
        });
      }
    } catch (error) {
      console.error('Error saving student:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan siswa",
        variant: "destructive"
      });
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Data Siswa</h2>
          <p className="text-muted-foreground">
            Kelola data siswa sekolah
          </p>
        </div>
        
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Siswa
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
              placeholder="Cari berdasarkan NIS, nama, atau kelas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <div className="ml-auto flex items-center gap-2">
              <Label htmlFor="filter-institution" className="text-sm text-muted-foreground">Lembaga</Label>
              <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                <SelectTrigger id="filter-institution" className="w-56">
                  <SelectValue placeholder="Semua lembaga" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua lembaga</SelectItem>
                  {institutions.map((i) => (
                    <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Data Siswa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NIS</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Kelas</TableHead>
              <TableHead>Lembaga</TableHead>
                <TableHead>Tahun Masuk</TableHead>
                <TableHead>Orang Tua</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Tidak ada data siswa
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((siswa) => (
                  <TableRow key={siswa.id}>
                    <TableCell className="font-medium">{siswa.nis}</TableCell>
                    <TableCell>{siswa.name}</TableCell>
                    <TableCell>{siswa.classes?.name || '-'}</TableCell>
                    <TableCell>{
                      typeof siswa.classes?.institutions === 'object'
                        ? (siswa.classes?.institutions?.name || '-')
                        : '-'
                    }</TableCell>
                    <TableCell>{siswa.admission_date ? new Date(siswa.admission_date).getFullYear() : "-"}</TableCell>
                    <TableCell>{siswa.parent_name || "-"}</TableCell>
                    <TableCell>{siswa.parent_phone || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={siswa.status === "active" ? "default" : "secondary"}>
                        {siswa.status === "active" ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(siswa)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(siswa.id)}
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
      <SiswaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedSiswa ? {
          id: selectedSiswa.id,
          nis: selectedSiswa.nis,
          nama: selectedSiswa.name,
          jenisKelamin: selectedSiswa.gender || "",
          tanggalLahir: selectedSiswa.birth_date || "",
          tempatLahir: selectedSiswa.birth_place || "",
          alamat: selectedSiswa.address || "",
          telepon: selectedSiswa.phone || "",
          namaOrtu: selectedSiswa.parent_name || "",
          teleponOrtu: selectedSiswa.parent_phone || "",
          status: selectedSiswa.status || "active",
          classId: selectedSiswa.class_id || ""
        } : undefined}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus"
        description="Apakah Anda yakin ingin menghapus data siswa ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
}