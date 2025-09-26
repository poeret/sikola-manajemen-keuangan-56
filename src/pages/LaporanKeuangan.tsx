import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart3, Download, Search, Filter, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockKeuangan = [
  { id: 1, kategori: "Penerimaan SPP", pemasukan: 45000000, pengeluaran: 0, saldo: 45000000 },
  { id: 2, kategori: "Operasional Sekolah", pemasukan: 0, pengeluaran: 15000000, saldo: -15000000 },
  { id: 3, kategori: "Penerimaan Ujian", pemasukan: 8000000, pengeluaran: 0, saldo: 8000000 },
  { id: 4, kategori: "Pemeliharaan", pemasukan: 0, pengeluaran: 5000000, saldo: -5000000 },
];

export default function LaporanKeuangan() {
  const [searchQuery, setSearchQuery] = useState("");

  const totalPemasukan = mockKeuangan.reduce((sum, item) => sum + item.pemasukan, 0);
  const totalPengeluaran = mockKeuangan.reduce((sum, item) => sum + item.pengeluaran, 0);
  const totalSaldo = totalPemasukan - totalPengeluaran;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Laporan Keuangan</h2>
          <p className="text-muted-foreground">
            Analisis komprehensif keuangan sekolah
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">Rp {totalPemasukan.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Periode berjalan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">Rp {totalPengeluaran.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Periode berjalan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Bersih</CardTitle>
            <DollarSign className={`h-4 w-4 ${totalSaldo >= 0 ? 'text-success' : 'text-destructive'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalSaldo >= 0 ? 'text-success' : 'text-destructive'}`}>
              Rp {totalSaldo.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Periode berjalan</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Laporan Per Kategori
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
                <TableHead>Kategori</TableHead>
                <TableHead>Pemasukan</TableHead>
                <TableHead>Pengeluaran</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockKeuangan.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.kategori}</TableCell>
                  <TableCell className="text-success">
                    {item.pemasukan > 0 ? `Rp ${item.pemasukan.toLocaleString()}` : '-'}
                  </TableCell>
                  <TableCell className="text-destructive">
                    {item.pengeluaran > 0 ? `Rp ${item.pengeluaran.toLocaleString()}` : '-'}
                  </TableCell>
                  <TableCell className={`text-right font-medium ${item.saldo >= 0 ? 'text-success' : 'text-destructive'}`}>
                    Rp {item.saldo.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-medium">
                <TableCell>Total</TableCell>
                <TableCell className="text-success">Rp {totalPemasukan.toLocaleString()}</TableCell>
                <TableCell className="text-destructive">Rp {totalPengeluaran.toLocaleString()}</TableCell>
                <TableCell className={`text-right font-bold ${totalSaldo >= 0 ? 'text-success' : 'text-destructive'}`}>
                  Rp {totalSaldo.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}