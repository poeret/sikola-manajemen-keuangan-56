import { useState } from "react";
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

// Mock data
const tahunAjaranData = [
  {
    id: 1,
    kode: "TA2024",
    deskripsi: "Tahun Ajaran 2024/2025",
    status: "Aktif",
    tanggalMulai: "2024-07-01",
    tanggalSelesai: "2025-06-30"
  },
  {
    id: 2,
    kode: "TA2023",
    deskripsi: "Tahun Ajaran 2023/2024", 
    status: "Tidak Aktif",
    tanggalMulai: "2023-07-01",
    tanggalSelesai: "2024-06-30"
  },
  {
    id: 3,
    kode: "TA2022",
    deskripsi: "Tahun Ajaran 2022/2023",
    status: "Tidak Aktif", 
    tanggalMulai: "2022-07-01",
    tanggalSelesai: "2023-06-30"
  }
];

export default function TahunAjaran() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const filteredData = tahunAjaranData.filter(item => 
    item.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Master Tahun Ajaran</h2>
          <p className="text-muted-foreground">
            Kelola data tahun ajaran sekolah
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Data
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Tahun Ajaran Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="kode">Kode Tahun Ajaran</Label>
                <Input id="kode" placeholder="Contoh: TA2025" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Input id="deskripsi" placeholder="Contoh: Tahun Ajaran 2025/2026" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tanggalMulai">Tanggal Mulai</Label>
                <Input id="tanggalMulai" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tanggalSelesai">Tanggal Selesai</Label>
                <Input id="tanggalSelesai" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="tidak-aktif">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>
                  Simpan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.kode}</TableCell>
                  <TableCell>{item.deskripsi}</TableCell>
                  <TableCell>{new Date(item.tanggalMulai).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>{new Date(item.tanggalSelesai).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "Aktif" ? "default" : "secondary"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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
    </div>
  );
}