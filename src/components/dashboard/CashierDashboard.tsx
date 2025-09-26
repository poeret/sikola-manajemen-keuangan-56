import { useState } from "react";
import { MetricCard } from "./MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  CreditCard,
  Search,
  User,
  Eye
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for cashier
const cashierMetrics = [
  {
    title: "Penerimaan Hari Ini (Kasir)",
    value: "Rp 8.750.000",
    icon: DollarSign,
  },
  {
    title: "Jumlah Transaksi Hari Ini (Kasir)",
    value: "12",
    icon: CreditCard,
  }
];

const myTransactions = [
  {
    id: "TRX001",
    siswa: "Ahmad Fauzi",
    nis: "20240001",
    kelas: "XII RPL 1",
    nominal: "Rp 500.000",
    waktu: "10:30 WIB",
    metode: "Tunai"
  },
  {
    id: "TRX002",
    siswa: "Siti Nurhaliza", 
    nis: "20240002",
    kelas: "XI TKJ 2",
    nominal: "Rp 750.000",
    waktu: "09:15 WIB",
    metode: "Transfer"
  },
  {
    id: "TRX003",
    siswa: "Budi Santoso",
    nis: "20240003",
    kelas: "X MM 1",
    nominal: "Rp 300.000",
    waktu: "08:45 WIB",
    metode: "Tunai"
  }
];

export function CashierDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    // Handle search logic
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Dashboard Kasir</h2>
        <p className="text-muted-foreground">
          Selamat datang! Kelola pembayaran siswa dengan mudah dan cepat.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Cari Siswa untuk Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Masukkan NIS atau Nama Siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Cari
            </Button>
          </div>
          {searchQuery && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                Hasil pencarian akan ditampilkan di sini
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cashierMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Riwayat Transaksi oleh Saya (Hari Ini)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Siswa</TableHead>
                <TableHead>NIS</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Metode</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myTransactions.map((trx) => (
                <TableRow key={trx.id}>
                  <TableCell className="font-medium">{trx.siswa}</TableCell>
                  <TableCell>{trx.nis}</TableCell>
                  <TableCell>{trx.kelas}</TableCell>
                  <TableCell>{trx.nominal}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      trx.metode === 'Tunai' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-success/10 text-success'
                    }`}>
                      {trx.metode}
                    </span>
                  </TableCell>
                  <TableCell>{trx.waktu}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
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