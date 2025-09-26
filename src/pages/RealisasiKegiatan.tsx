import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator, Plus, Search, Edit, Trash2, Calendar, CheckCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockRealisasi = [
  { id: 1, kegiatan: "Pembelian Peralatan Lab", anggaranRencana: 15000000, realisasi: 14500000, tanggal: "2024-02-20", status: "Selesai", selisih: -500000 },
  { id: 2, kegiatan: "Perbaikan Gedung Kelas", anggaranRencana: 25000000, realisasi: 27000000, tanggal: "2024-03-05", status: "Selesai", selisih: 2000000 },
  { id: 3, kegiatan: "Kegiatan Ekstrakurikuler", anggaranRencana: 5000000, realisasi: 4800000, tanggal: "2024-02-25", status: "Berlangsung", selisih: -200000 },
];

export default function RealisasiKegiatan() {
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selesai":
        return "bg-success/10 text-success";
      case "Berlangsung":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  const getSelisihColor = (selisih: number) => {
    return selisih >= 0 ? "text-destructive" : "text-success";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Realisasi Kegiatan</h2>
          <p className="text-muted-foreground">
            Pantau realisasi anggaran dan pelaksanaan kegiatan
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Realisasi
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Daftar Realisasi Kegiatan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari realisasi kegiatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kegiatan</TableHead>
                <TableHead>Anggaran Rencana</TableHead>
                <TableHead>Realisasi</TableHead>
                <TableHead>Selisih</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRealisasi.map((realisasi) => (
                <TableRow key={realisasi.id}>
                  <TableCell className="font-medium">{realisasi.kegiatan}</TableCell>
                  <TableCell>Rp {realisasi.anggaranRencana.toLocaleString()}</TableCell>
                  <TableCell>Rp {realisasi.realisasi.toLocaleString()}</TableCell>
                  <TableCell className={getSelisihColor(realisasi.selisih)}>
                    {realisasi.selisih >= 0 ? '+' : ''}Rp {realisasi.selisih.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {realisasi.tanggal}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(realisasi.status)}`}>
                      {realisasi.status === 'Selesai' && <CheckCircle className="mr-1 h-3 w-3" />}
                      {realisasi.status}
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