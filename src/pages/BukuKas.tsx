import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DollarSign, Plus, Search, TrendingUp, TrendingDown, Calendar } from "lucide-react";
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

const mockTransaksi = [
  { id: 1, tanggal: "2024-01-15", keterangan: "Penerimaan SPP Siswa", jenis: "Pemasukan", nominal: 15000000, saldo: 50000000 },
  { id: 2, tanggal: "2024-01-16", keterangan: "Pembelian ATK", jenis: "Pengeluaran", nominal: 2500000, saldo: 47500000 },
  { id: 3, tanggal: "2024-01-17", keterangan: "Penerimaan Ujian", jenis: "Pemasukan", nominal: 8000000, saldo: 55500000 },
];

export default function BukuKas() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    keterangan: "",
    jenis: "",
    nominal: "",
    tanggal: ""
  });
  const { toast } = useToast();

  const getJenisColor = (jenis: string) => {
    return jenis === "Pemasukan" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive";
  };

  const getJenisIcon = (jenis: string) => {
    return jenis === "Pemasukan" ? TrendingUp : TrendingDown;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Buku Kas Umum</h2>
          <p className="text-muted-foreground">
            Catatan seluruh transaksi keuangan sekolah
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Transaksi
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Kas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 55.500.000</div>
            <p className="text-xs text-muted-foreground">Per hari ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">Rp 23.000.000</div>
            <p className="text-xs text-muted-foreground">Bulan ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">Rp 2.500.000</div>
            <p className="text-xs text-muted-foreground">Bulan ini</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Catatan Transaksi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari transaksi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransaksi.map((transaksi) => {
                const JenisIcon = getJenisIcon(transaksi.jenis);
                return (
                  <TableRow key={transaksi.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {transaksi.tanggal}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{transaksi.keterangan}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getJenisColor(transaksi.jenis)}`}>
                        <JenisIcon className="mr-1 h-3 w-3" />
                        {transaksi.jenis}
                      </span>
                    </TableCell>
                    <TableCell className={transaksi.jenis === 'Pemasukan' ? 'text-success' : 'text-destructive'}>
                      {transaksi.jenis === 'Pemasukan' ? '+' : '-'}Rp {transaksi.nominal.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      Rp {transaksi.saldo.toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Tambah Transaksi */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Transaksi Kas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal</Label>
              <Input
                id="tanggal"
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keterangan">Keterangan</Label>
              <Input
                id="keterangan"
                placeholder="Contoh: Penerimaan SPP Siswa"
                value={formData.keterangan}
                onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jenis">Jenis Transaksi</Label>
              <Select value={formData.jenis} onValueChange={(value) => setFormData({...formData, jenis: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis transaksi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pemasukan">Pemasukan</SelectItem>
                  <SelectItem value="Pengeluaran">Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nominal">Nominal</Label>
              <Input
                id="nominal"
                type="number"
                placeholder="0"
                value={formData.nominal}
                onChange={(e) => setFormData({...formData, nominal: e.target.value})}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Batal
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: "Transaksi Berhasil Ditambah",
                    description: "Transaksi kas baru telah berhasil dicatat.",
                  });
                  setFormData({ keterangan: "", jenis: "", nominal: "", tanggal: "" });
                  setShowAddDialog(false);
                }}
                disabled={!formData.keterangan || !formData.jenis || !formData.nominal || !formData.tanggal}
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