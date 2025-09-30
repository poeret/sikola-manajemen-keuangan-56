import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SiswaData {
  id: string;
  nis: string;
  name: string;
  class_id: string | null;
}

interface TagihanData {
  id: string; // student_bill id
  name: string; // joined from bills.name
  amount: number;
  due_date: string | null;
  status: string | null; // payment_status enum (pending|paid|overdue|cancelled)
}

export default function PembayaranSPP() {
  const [searchQuery, setSearchQuery] = useState("");
  const [siswa, setSiswa] = useState<SiswaData[]>([]);
  const [tagihan, setTagihan] = useState<TagihanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSiswa, setSelectedSiswa] = useState<SiswaData | null>(null);
  const [selectedTagihan, setSelectedTagihan] = useState<string[]>([]);
  const [jumlahBayar, setJumlahBayar] = useState("");
  const [metodePembayaran, setMetodePembayaran] = useState("");
  const { toast } = useToast();

  // Load data from database
  useEffect(() => {
    loadSiswa();
  }, []);

  const loadSiswa = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, nis, name, class_id')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error loading students:', error);
        toast({
          title: "Error",
          description: "Gagal memuat data siswa",
          variant: "destructive"
        });
        return;
      }

      setSiswa(data || []);
    } catch (error) {
      console.error('Error loading students:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data siswa",
        variant: "destructive"
      });
    }
  };

  const loadTagihan = async (studentId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('student_bills')
        .select('id, amount, due_date, status, bills(name)')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading student bills:', error);
        toast({
          title: "Error",
          description: "Gagal memuat data tagihan siswa",
          variant: "destructive"
        });
        return;
      }

      const mapped: TagihanData[] = (data || []).map((row: any) => ({
        id: row.id,
        name: row.bills?.name || 'Tagihan',
        amount: row.amount,
        due_date: row.due_date,
        status: row.status,
      }));

      setTagihan(mapped);
    } catch (error) {
      console.error('Error loading student bills:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data tagihan siswa",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const [catatan, setCatatan] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case 'paid':
        return 'Lunas';
      case 'pending':
        return 'Menunggu';
      case 'overdue':
        return 'Jatuh Tempo';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return 'Belum Bayar';
    }
  };

  const isSelectable = (status: string | null) => status !== 'paid' && status !== 'cancelled';

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const foundSiswa = siswa.find(s => 
        s.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSelectedSiswa(foundSiswa || null);
      if (foundSiswa) {
        loadTagihan(foundSiswa.id);
      } else {
        setTagihan([]);
      }
    }
  };

  const handleTagihanChange = (tagihanId: string, checked: boolean) => {
    if (checked) {
      setSelectedTagihan([...selectedTagihan, tagihanId]);
    } else {
      setSelectedTagihan(selectedTagihan.filter(id => id !== tagihanId));
    }
  };

  const calculateSelectedTotal = () => {
    return selectedTagihan.reduce((total, id) => {
      const tagihanItem = tagihan.find(t => t.id === id);
      return total + (tagihanItem?.amount || 0);
    }, 0);
  };

  const handlePayment = async () => {
    try {
      // For each selected student_bill, create a payment and mark as paid
      for (const studentBillId of selectedTagihan) {
        const current = tagihan.find(t => t.id === studentBillId);
        const payAmount = current?.amount || 0;

        const { error: payErr } = await supabase
          .from('payments')
          .insert({
            student_bill_id: studentBillId,
            amount: payAmount,
            payment_method: metodePembayaran,
            notes: catatan,
          });
        if (payErr) {
          console.error('Error creating payment:', payErr);
          throw payErr;
        }

        const { error: updErr } = await supabase
          .from('student_bills')
          .update({ status: 'paid' })
          .eq('id', studentBillId);
        if (updErr) {
          console.error('Error updating student bill status:', updErr);
          throw updErr;
        }
      }

      setShowSuccessModal(true);
      toast({
        title: "Berhasil",
        description: "Pembayaran berhasil diproses"
      });

      // Reset form
      setTimeout(() => {
        setSelectedTagihan([]);
        setJumlahBayar("");
        setMetodePembayaran("");
        setCatatan("");
        setShowSuccessModal(false);
        if (selectedSiswa) {
          loadTagihan(selectedSiswa.id);
        }
        setSelectedSiswa(null);
        setSearchQuery("");
      }, 3000);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error",
        description: "Gagal memproses pembayaran",
        variant: "destructive"
      });
    }
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
                  <h3 className="font-semibold text-lg">{selectedSiswa.name}</h3>
                  <p className="text-muted-foreground">NIS: {selectedSiswa.nis}</p>
                  <p className="text-muted-foreground">Kelas: -</p>
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
              <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Total Tagihan Tersedia</p>
                  <p className="text-xs text-muted-foreground">Tagihan yang dapat dibayar</p>
                </div>
                <p className="font-bold text-primary">
                  Rp {tagihan.reduce((total, t) => total + t.amount, 0).toLocaleString('id-ID')}
                </p>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg border-2 border-dashed">
                <div>
                  <p className="font-semibold">Total Tagihan Terpilih</p>
                  <p className="text-xs text-muted-foreground">Tagihan yang dipilih untuk dibayar</p>
                </div>
                <p className="text-xl font-bold">
                  Rp {calculateSelectedTotal().toLocaleString('id-ID')}
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : tagihan.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Tidak ada data tagihan
                    </TableCell>
                  </TableRow>
                ) : (
                  tagihan.map((tagihanItem) => (
                    <TableRow key={tagihanItem.id}>
                      <TableCell>
                        {isSelectable(tagihanItem.status) && (
                          <Checkbox
                            checked={selectedTagihan.includes(tagihanItem.id)}
                            onCheckedChange={(checked) => 
                              handleTagihanChange(tagihanItem.id, checked as boolean)
                            }
                          />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{tagihanItem.name}</TableCell>
                      <TableCell>{tagihanItem.due_date ? new Date(tagihanItem.due_date).toLocaleDateString('id-ID') : "-"}</TableCell>
                      <TableCell>Rp {tagihanItem.amount.toLocaleString('id-ID')}</TableCell>
                      <TableCell>
                        <Badge variant={
                          tagihanItem.status === "paid" ? "default" : "destructive"
                        }>
                          {tagihanItem.status === "paid" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {getStatusLabel(tagihanItem.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {tagihanItem.status === "paid" ? 
                          new Date().toLocaleDateString('id-ID') : 
                          "-"
                        }
                      </TableCell>
                    </TableRow>
                  ))
                )}
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