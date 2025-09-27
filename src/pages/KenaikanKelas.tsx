import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, Search, ArrowUp, CheckCircle, Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { KenaikanKelasForm } from "@/components/forms/KenaikanKelasForm";

// Data akan diambil dari Supabase database
const mockKenaikan: any[] = [];

export default function KenaikanKelas() {
  const [searchQuery, setSearchQuery] = useState("");
  const [kenaikan, setKenaikan] = useState(mockKenaikan);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedKenaikan, setSelectedKenaikan] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [kenaikanToDelete, setKenaikanToDelete] = useState<number | null>(null);
  const [showKenaikanDialog, setShowKenaikanDialog] = useState(false);
  const { toast } = useToast();

  const filteredKenaikan = kenaikan.filter(item => 
    item.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kelasSaatIni.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kelasTujuan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedKenaikan(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedKenaikan(item);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setKenaikanToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (kenaikanToDelete) {
      setKenaikan(prev => prev.filter(item => item.id !== kenaikanToDelete));
      toast({
        title: "Berhasil",
        description: "Data kenaikan kelas berhasil dihapus"
      });
    }
    setDeleteDialogOpen(false);
    setKenaikanToDelete(null);
  };

  const handleSubmit = (data: any) => {
    if (formMode === "create") {
      const newKenaikan = {
        ...data,
        id: Math.max(...kenaikan.map(k => k.id)) + 1
      };
      setKenaikan(prev => [...prev, newKenaikan]);
      toast({
        title: "Berhasil",
        description: "Data kenaikan kelas berhasil ditambahkan"
      });
    } else {
      setKenaikan(prev => prev.map(item => 
        item.id === selectedKenaikan?.id ? { ...data, id: selectedKenaikan.id } : item
      ));
      toast({
        title: "Berhasil",
        description: "Data kenaikan kelas berhasil diperbarui"
      });
    }
    setFormOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Naik":
        return "bg-success/10 text-success";
      case "Pending":
        return "bg-warning/10 text-warning";
      case "Tinggal Kelas":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kenaikan Kelas</h2>
          <p className="text-muted-foreground">
            Kelola proses kenaikan kelas siswa
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Data
          </Button>
          <Button onClick={() => setShowKenaikanDialog(true)}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Proses Kenaikan
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Data Kenaikan Kelas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NIS</TableHead>
                <TableHead>Nama Siswa</TableHead>
                <TableHead>Kelas Saat Ini</TableHead>
                <TableHead>Kelas Tujuan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKenaikan.map((siswa) => (
                <TableRow key={siswa.id}>
                  <TableCell className="font-medium">{siswa.nis}</TableCell>
                  <TableCell>{siswa.nama}</TableCell>
                  <TableCell>{siswa.kelasSaatIni}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ArrowUp className="h-4 w-4 text-primary" />
                      {siswa.kelasTujuan}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(siswa.status)}`}>
                      {siswa.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Proses Kenaikan */}
      <Dialog open={showKenaikanDialog} onOpenChange={setShowKenaikanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Proses Kenaikan Kelas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Apakah Anda yakin ingin memproses kenaikan kelas untuk semua siswa yang berstatus "Naik"?</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowKenaikanDialog(false)}>
                Batal
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: "Kenaikan Kelas Berhasil",
                    description: "Proses kenaikan kelas telah berhasil dilakukan.",
                  });
                  setShowKenaikanDialog(false);
                }}
              >
                Proses
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      <KenaikanKelasForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedKenaikan}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus"
        description="Apakah Anda yakin ingin menghapus data kenaikan kelas ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
}