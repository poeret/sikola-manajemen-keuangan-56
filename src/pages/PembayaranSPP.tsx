import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  User, 
  DollarSign, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  Receipt,
  Check
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data
const mockSiswa = {
  nis: "20240001",
  nama: "Ahmad Fauzi Rahman",
  kelas: "XII RPL 1",
  foto: null,
  tunggakanTahunSebelumnya: 2500000,
  tagihanTahunIni: 4800000,
  totalTagihan: 7300000
};

const mockTagihan = [
  {
    id: 1,
    nama: "SPP Januari 2024",
    periode: "Januari 2024",
    nominal: 400000,
    status: "Lunas",
    tanggalBayar: "2024-01-05"
  },
  {
    id: 2,
    nama: "SPP Februari 2024", 
    periode: "Februari 2024",
    nominal: 400000,
    status: "Lunas",
    tanggalBayar: "2024-02-05"
  },
  {
    id: 3,
    nama: "SPP Maret 2024",
    periode: "Maret 2024", 
    nominal: 400000,
    status: "Belum Lunas",
    tanggalBayar: null
  },
  {
    id: 4,
    nama: "SPP April 2024",
    periode: "April 2024",
    nominal: 400000, 
    status: "Belum Lunas",
    tanggalBayar: null
  },
  {
    id: 5,
    nama: "Uang Praktik",
    periode: "2024/2025",
    nominal: 1200000,
    status: "Bayar Sebagian",
    tanggalBayar: "2024-01-15"
  },
  {
    id: 6,
    nama: "Uang Seragam",
    periode: "2024/2025", 
    nominal: 800000,
    status: "Belum Lunas",
    tanggalBayar: null
  }
];

export default function PembayaranSPP() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSiswa, setSelectedSiswa] = useState<typeof mockSiswa | null>(null);
  const [selectedTagihan, setSelectedTagihan] = useState<number[]>([]);
  const [jumlahBayar, setJumlahBayar] = useState("");
  const [metodePembayaran, setMetodePembayaran] = useState("");
  const [catatan, setCatatan] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Mock search result
      setSelectedSiswa(mockSiswa);
    }
  };

  const handleTagihanChange = (tagihanId: number, checked: boolean) => {
    if (checked) {
      setSelectedTagihan([...selectedTagihan, tagihanId]);
    } else {
      setSelectedTagihan(selectedTagihan.filter(id => id !== tagihanId));
    }
  };

  const calculateSelectedTotal = () => {
    return selectedTagihan.reduce((total, id) => {
      const tagihan = mockTagihan.find(t => t.id === id);
      return total + (tagihan?.nominal || 0);
    }, 0);
  };

  const handlePayment = () => {
    setShowSuccessModal(true);
    // Reset form
    setTimeout(() => {
      setSelectedTagihan([]);
      setJumlahBayar("");
      setMetodePembayaran("");
      setCatatan("");
      setShowSuccessModal(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Pembayaran SPP</h2>
        <p className="text-muted-foreground">
          Proses pembayaran SPP dan tagihan sekolah
        </p>
      </div>

      {/* Step 1: Search Student */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Cari Siswa
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
        </CardContent>
      </Card>

      {/* Step 2: Student & Billing Details */}
      {selectedSiswa && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Data Siswa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedSiswa.nama}</h3>
                  <p className="text-muted-foreground">NIS: {selectedSiswa.nis}</p>
                  <p className="text-muted-foreground">Kelas: {selectedSiswa.kelas}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Ringkasan Tagihan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-destructive/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Total Tunggakan Tahun Sebelumnya</p>
                  <p className="text-xs text-muted-foreground">Belum dibayar dari tahun lalu</p>
                </div>
                <p className="font-bold text-destructive">
                  Rp {selectedSiswa.tunggakanTahunSebelumnya.toLocaleString('id-ID')}
                </p>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Total Tagihan Tahun Ini</p>
                  <p className="text-xs text-muted-foreground">Tagihan tahun ajaran aktif</p>
                </div>
                <p className="font-bold text-primary">
                  Rp {selectedSiswa.tagihanTahunIni.toLocaleString('id-ID')}
                </p>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg border-2 border-dashed">
                <div>
                  <p className="font-semibold">Grand Total Tagihan</p>
                  <p className="text-xs text-muted-foreground">Total keseluruhan</p>
                </div>
                <p className="text-xl font-bold">
                  Rp {selectedSiswa.totalTagihan.toLocaleString('id-ID')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Detailed Bills */}
      {selectedSiswa && (
        <Card>
          <CardHeader>
            <CardTitle>Rincian Tagihan</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Nama Tagihan</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Bayar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTagihan.map((tagihan) => (
                  <TableRow key={tagihan.id}>
                    <TableCell>
                      {tagihan.status !== "Lunas" && (
                        <Checkbox
                          checked={selectedTagihan.includes(tagihan.id)}
                          onCheckedChange={(checked) => 
                            handleTagihanChange(tagihan.id, checked as boolean)
                          }
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{tagihan.nama}</TableCell>
                    <TableCell>{tagihan.periode}</TableCell>
                    <TableCell>Rp {tagihan.nominal.toLocaleString('id-ID')}</TableCell>
                    <TableCell>
                      <Badge variant={
                        tagihan.status === "Lunas" ? "default" :
                        tagihan.status === "Bayar Sebagian" ? "secondary" : "destructive"
                      }>
                        {tagihan.status === "Lunas" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {tagihan.status === "Bayar Sebagian" && <AlertCircle className="h-3 w-3 mr-1" />}
                        {tagihan.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {tagihan.tanggalBayar ? 
                        new Date(tagihan.tanggalBayar).toLocaleDateString('id-ID') : 
                        "-"
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Payment Form */}
      {selectedSiswa && selectedTagihan.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Proses Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jumlahBayar">Jumlah Bayar</Label>
                <Input
                  id="jumlahBayar"
                  type="number"
                  placeholder="0"
                  value={jumlahBayar || calculateSelectedTotal()}
                  onChange={(e) => setJumlahBayar(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Total terpilih: Rp {calculateSelectedTotal().toLocaleString('id-ID')}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metodePembayaran">Metode Pembayaran</Label>
                <Select value={metodePembayaran} onValueChange={setMetodePembayaran}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih metode pembayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tunai">Tunai</SelectItem>
                    <SelectItem value="transfer">Transfer Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan (Opsional)</Label>
              <Textarea
                id="catatan"
                placeholder="Catatan pembayaran..."
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
              />
            </div>
            <Button 
              onClick={handlePayment}
              className="w-full bg-success hover:bg-success/90"
              disabled={!metodePembayaran}
            >
              <Check className="h-4 w-4 mr-2" />
              Konfirmasi Pembayaran
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-success">
              <CheckCircle className="h-6 w-6" />
              Pembayaran Berhasil!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p>Pembayaran telah berhasil diproses.</p>
            <Button className="w-full">
              <Receipt className="h-4 w-4 mr-2" />
              Cetak Kuitansi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}