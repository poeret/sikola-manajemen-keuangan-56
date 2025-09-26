import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Receipt, Plus, Search, Edit, Trash2 } from "lucide-react";
import { TagihanForm } from "@/components/forms/TagihanForm";
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

const initialTagihan = [
  { id: 1, kode: "SPP-2024", nama: "SPP Bulanan", nominal: 500000, kategori: "SPP", status: "Aktif" },
  { id: 2, kode: "UTS-2024", nama: "Ujian Tengah Semester", nominal: 150000, kategori: "Ujian", status: "Aktif" },
  { id: 3, kode: "UAS-2024", nama: "Ujian Akhir Semester", nominal: 200000, kategori: "Ujian", status: "Aktif" },
];

export default function Tagihan() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tagihan, setTagihan] = useState(initialTagihan);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedTagihan, setSelectedTagihan] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tagihanToDelete, setTagihanToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  const filteredTagihan = tagihan.filter(item =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedTagihan(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedTagihan(item);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setTagihanToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tagihanToDelete) {
      setTagihan(prev => prev.filter(item => item.id !== tagihanToDelete));
      toast({
        title: "Berhasil",
        description: "Tagihan berhasil dihapus"
      });
    }
    setDeleteDialogOpen(false);
    setTagihanToDelete(null);
  };

  const handleSubmit = (data: any) => {
    if (formMode === "create") {
      const newTagihan = {
        ...data,
        id: Math.max(...tagihan.map(t => t.id)) + 1
      };
      setTagihan(prev => [...prev, newTagihan]);
      toast({
        title: "Berhasil",
        description: "Tagihan berhasil ditambahkan"
      });
    } else {
      setTagihan(prev => prev.map(item => 
        item.id === selectedTagihan?.id ? { ...data, id: selectedTagihan.id } : item
      ));
      toast({
        title: "Berhasil",
        description: "Tagihan berhasil diperbarui"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Data Tagihan</h2>
          <p className="text-muted-foreground">
            Kelola jenis tagihan dan nominal pembayaran
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Tagihan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Daftar Tagihan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari tagihan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama Tagihan</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTagihan.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.kode}</TableCell>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>Rp {item.nominal.toLocaleString()}</TableCell>
                  <TableCell>{item.kategori}</TableCell>
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

      <TagihanForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedTagihan}
        mode={formMode}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Hapus Tagihan"
        description="Apakah Anda yakin ingin menghapus tagihan ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={confirmDelete}
      />
    </div>
  );
}