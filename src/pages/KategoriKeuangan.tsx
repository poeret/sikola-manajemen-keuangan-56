import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderOpen, Plus, Search, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockKategori = [
  { id: 1, kode: "PEN-001", nama: "Penerimaan SPP", jenis: "Pemasukan", deskripsi: "Pembayaran SPP siswa", status: "Aktif" },
  { id: 2, kode: "KEL-001", nama: "Operasional Sekolah", jenis: "Pengeluaran", deskripsi: "Biaya operasional harian", status: "Aktif" },
  { id: 3, kode: "PEN-002", nama: "Penerimaan Ujian", jenis: "Pemasukan", deskripsi: "Biaya ujian siswa", status: "Aktif" },
];

export default function KategoriKeuangan() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    jenis: "",
    deskripsi: ""
  });
  const { toast } = useToast();

  const getJenisColor = (jenis: string) => {
    return jenis === "Pemasukan" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kategori Keuangan</h2>
          <p className="text-muted-foreground">
            Kelola kategori pemasukan dan pengeluaran
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kategori
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Daftar Kategori Keuangan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama Kategori</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockKategori.map((kategori) => (
                <TableRow key={kategori.id}>
                  <TableCell className="font-medium">{kategori.kode}</TableCell>
                  <TableCell>{kategori.nama}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getJenisColor(kategori.jenis)}`}>
                      {kategori.jenis}
                    </span>
                  </TableCell>
                  <TableCell>{kategori.deskripsi}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-success/10 text-success">
                      {kategori.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Edit Kategori",
                            description: `Mengedit kategori ${kategori.nama}`,
                          });
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Hapus Kategori",
                            description: `Kategori ${kategori.nama} telah dihapus`,
                          });
                        }}
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

      {/* Dialog Tambah Kategori */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Keuangan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="kode">Kode Kategori</Label>
              <Input
                id="kode"
                placeholder="Contoh: PEN-001"
                value={formData.kode}
                onChange={(e) => setFormData({...formData, kode: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Kategori</Label>
              <Input
                id="nama"
                placeholder="Contoh: Penerimaan SPP"
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jenis">Jenis</Label>
              <Select value={formData.jenis} onValueChange={(value) => setFormData({...formData, jenis: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pemasukan">Pemasukan</SelectItem>
                  <SelectItem value="Pengeluaran">Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                placeholder="Deskripsi kategori..."
                value={formData.deskripsi}
                onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Batal
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: "Kategori Berhasil Ditambah",
                    description: "Kategori keuangan baru telah berhasil ditambahkan.",
                  });
                  setFormData({ kode: "", nama: "", jenis: "", deskripsi: "" });
                  setShowAddDialog(false);
                }}
                disabled={!formData.kode || !formData.nama || !formData.jenis}
              >
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}