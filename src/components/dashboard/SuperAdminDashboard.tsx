import { MetricCard } from "./MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  AlertCircle, 
  Users, 
  CreditCard,
  TrendingUp,
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
import { Button } from "@/components/ui/button";

// Mock data
const metrics = [
  {
    title: "Total Penerimaan Bulan Ini",
    value: "Rp 125.400.000",
    icon: DollarSign,
    trend: { value: "12%", isPositive: true }
  },
  {
    title: "Total Tunggakan",
    value: "Rp 18.500.000",
    icon: AlertCircle,
    trend: { value: "8%", isPositive: false }
  },
  {
    title: "Total Siswa Aktif",
    value: "1.247",
    icon: Users,
    trend: { value: "3%", isPositive: true }
  },
  {
    title: "Total Transaksi Hari Ini",
    value: "43",
    icon: CreditCard,
    trend: { value: "15%", isPositive: true }
  }
];

const recentTransactions = [
  {
    id: "TRX001",
    siswa: "Ahmad Fauzi",
    kelas: "XII RPL 1",
    nominal: "Rp 500.000",
    waktu: "10:30 WIB",
    status: "Lunas"
  },
  {
    id: "TRX002",
    siswa: "Siti Nurhaliza",
    kelas: "XI TKJ 2",
    nominal: "Rp 750.000",
    waktu: "09:15 WIB",
    status: "Lunas"
  },
  {
    id: "TRX003",
    siswa: "Budi Santoso",
    kelas: "X MM 1",
    nominal: "Rp 300.000",
    waktu: "08:45 WIB",
    status: "Sebagian"
  },
  {
    id: "TRX004",
    siswa: "Maya Sari",
    kelas: "XII AKL 1",
    nominal: "Rp 600.000",
    waktu: "08:20 WIB",
    status: "Lunas"
  },
  {
    id: "TRX005",
    siswa: "Rizki Pratama",
    kelas: "XI RPL 2",
    nominal: "Rp 450.000",
    waktu: "07:55 WIB",
    status: "Lunas"
  }
];

export function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Dashboard Super Admin</h2>
        <p className="text-muted-foreground">
          Selamat datang kembali! Berikut ringkasan keuangan sekolah hari ini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Grafik Penerimaan 6 Bulan Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                <p>Grafik akan ditampilkan di sini</p>
                <p className="text-sm">Integrasi dengan library chart akan dilakukan</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5 Transaksi Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Siswa</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((trx) => (
                  <TableRow key={trx.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{trx.siswa}</p>
                        <p className="text-xs text-muted-foreground">{trx.waktu}</p>
                      </div>
                    </TableCell>
                    <TableCell>{trx.kelas}</TableCell>
                    <TableCell>{trx.nominal}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        trx.status === 'Lunas' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {trx.status}
                      </span>
                    </TableCell>
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
    </div>
  );
}