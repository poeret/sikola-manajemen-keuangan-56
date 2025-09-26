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
import { Plus, Search, Edit, Trash2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data
const siswaData = [
  {
    id: 1,
    nis: "20240001",
    nama: "Ahmad Fauzi Rahman",
    kelas: "XII RPL 1",
    tahunMasuk: "2021",
    alamat: "Jl. Merdeka No. 123, Jakarta",
    namaOrtu: "Bapak Rahman",
    kontakOrtu: "081234567890",
    status: "Aktif"
  },
  {
    id: 2,
    nis: "20240002", 
    nama: "Siti Nurhaliza",
    kelas: "XI TKJ 2",
    tahunMasuk: "2022",
    alamat: "Jl. Sudirman No. 456, Jakarta",
    namaOrtu: "Ibu Sari",
    kontakOrtu: "081234567891",
    status: "Aktif"
  },
  {
    id: 3,
    nis: "20240003",
    nama: "Budi Santoso",
    kelas: "X MM 1", 
    tahunMasuk: "2023",
    alamat: "Jl. Thamrin No. 789, Jakarta",
    namaOrtu: "Bapak Santoso",
    kontakOrtu: "081234567892",
    status: "Aktif"
  }
];

export default function DataSiswa() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const filteredData = siswaData.filter(item => 
    item.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kelas.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Data Siswa</h2>
          <p className="text-muted-foreground">
            Kelola data siswa sekolah
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Siswa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Siswa Baru</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nis">NIS</Label>
                <Input id="nis" placeholder="Nomor Induk Siswa" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input id="nama" placeholder="Nama lengkap siswa" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kelas">Kelas</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="X-RPL-1">X RPL 1</SelectItem>
                    <SelectItem value="X-TKJ-1">X TKJ 1</SelectItem>
                    <SelectItem value="X-MM-1">X MM 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tahunMasuk">Tahun Masuk</Label>
                <Input id="tahunMasuk" placeholder="2024" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Input id="alamat" placeholder="Alamat lengkap siswa" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="namaOrtu">Nama Orang Tua</Label>
                <Input id="namaOrtu" placeholder="Nama orang tua/wali" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kontakOrtu">Kontak Orang Tua</Label>
                <Input id="kontakOrtu" placeholder="Nomor HP orang tua" />
              </div>
              <div className="col-span-2 flex justify-end gap-2">
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
              placeholder="Cari berdasarkan NIS, nama, atau kelas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
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
                <TableHead>Tahun Masuk</TableHead>
                <TableHead>Orang Tua</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((siswa) => (
                <TableRow key={siswa.id}>
                  <TableCell className="font-medium">{siswa.nis}</TableCell>
                  <TableCell>{siswa.nama}</TableCell>
                  <TableCell>{siswa.kelas}</TableCell>
                  <TableCell>{siswa.tahunMasuk}</TableCell>
                  <TableCell>{siswa.namaOrtu}</TableCell>
                  <TableCell>{siswa.kontakOrtu}</TableCell>
                  <TableCell>
                    <Badge variant={siswa.status === "Aktif" ? "default" : "secondary"}>
                      {siswa.status}
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