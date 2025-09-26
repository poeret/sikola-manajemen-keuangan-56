import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderOpen, Plus, Search, Edit, Trash2 } from "lucide-react";
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
        <Button>
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