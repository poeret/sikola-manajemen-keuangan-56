import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Plus, Search, Edit, Trash2, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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

const mockRencana = [
  { id: 1, kegiatan: "Pembelian Peralatan Lab", anggaran: 15000000, tanggal: "2024-02-15", status: "Direncanakan", kategori: "Operasional" },
  { id: 2, kegiatan: "Perbaikan Gedung Kelas", anggaran: 25000000, tanggal: "2024-03-01", status: "Disetujui", kategori: "Infrastruktur" },
  { id: 3, kegiatan: "Kegiatan Ekstrakurikuler", anggaran: 5000000, tanggal: "2024-02-20", status: "Pending", kategori: "Kesiswaan" },
];

export default function RencanaKegiatan() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    kegiatan: "",
    anggaran: "",
    tanggal: "",
    kategori: ""
  });
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disetujui":
        return "bg-success/10 text-success";
      case "Pending":
        return "bg-warning/10 text-warning";
      case "Direncanakan":
        return "bg-info/10 text-info";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rencana Kegiatan</h2>
          <p className="text-muted-foreground">
            Kelola rencana kegiatan dan anggaran sekolah
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Rencana
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Daftar Rencana Kegiatan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari rencana kegiatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kegiatan</TableHead>
                <TableHead>Anggaran</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRencana.map((rencana) => (
                <TableRow key={rencana.id}>
                  <TableCell className="font-medium">{rencana.kegiatan}</TableCell>
                  <TableCell>Rp {rencana.anggaran.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {rencana.tanggal}
                    </div>
                  </TableCell>
                  <TableCell>{rencana.kategori}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(rencana.status)}`}>
                      {rencana.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Edit Rencana",
                            description: `Mengedit ${rencana.kegiatan}`,
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
                            title: "Hapus Rencana",
                            description: `${rencana.kegiatan} telah dihapus`,
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

      {/* Dialog Tambah Rencana */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Rencana Kegiatan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="kegiatan">Nama Kegiatan</Label>
              <Input
                id="kegiatan"
                placeholder="Contoh: Pembelian Peralatan Lab"
                value={formData.kegiatan}
                onChange={(e) => setFormData({...formData, kegiatan: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anggaran">Anggaran</Label>
              <Input
                id="anggaran"
                type="number"
                placeholder="0"
                value={formData.anggaran}
                onChange={(e) => setFormData({...formData, anggaran: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal Rencana</Label>
              <Input
                id="tanggal"
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kategori">Kategori</Label>
              <Select value={formData.kategori} onValueChange={(value) => setFormData({...formData, kategori: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Operasional">Operasional</SelectItem>
                  <SelectItem value="Infrastruktur">Infrastruktur</SelectItem>
                  <SelectItem value="Kesiswaan">Kesiswaan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Batal
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: "Rencana Berhasil Ditambah",
                    description: "Rencana kegiatan baru telah berhasil ditambahkan.",
                  });
                  setFormData({ kegiatan: "", anggaran: "", tanggal: "", kategori: "" });
                  setShowAddDialog(false);
                }}
                disabled={!formData.kegiatan || !formData.anggaran || !formData.tanggal || !formData.kategori}
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