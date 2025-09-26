import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, Search, ArrowUp, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockKenaikan = [
  { id: 1, nis: "20240001", nama: "Ahmad Fauzi", kelasSaatIni: "XI RPL 1", kelasTujuan: "XII RPL 1", status: "Naik" },
  { id: 2, nis: "20240002", nama: "Siti Nurhaliza", kelasSaatIni: "X TKJ 2", kelasTujuan: "XI TKJ 2", status: "Naik" },
  { id: 3, nis: "20240003", nama: "Budi Santoso", kelasSaatIni: "XI MM 1", kelasTujuan: "XII MM 1", status: "Pending" },
];

export default function KenaikanKelas() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showKenaikanDialog, setShowKenaikanDialog] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Naik":
        return "bg-success/10 text-success";
      case "Pending":
        return "bg-warning/10 text-warning";
      case "Tinggal Kelas":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kenaikan Kelas</h2>
          <p className="text-muted-foreground">
            Kelola proses kenaikan kelas siswa
          </p>
        </div>
        <Button onClick={() => setShowKenaikanDialog(true)}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Proses Kenaikan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Data Kenaikan Kelas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NIS</TableHead>
                <TableHead>Nama Siswa</TableHead>
                <TableHead>Kelas Saat Ini</TableHead>
                <TableHead>Kelas Tujuan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockKenaikan.map((siswa) => (
                <TableRow key={siswa.id}>
                  <TableCell className="font-medium">{siswa.nis}</TableCell>
                  <TableCell>{siswa.nama}</TableCell>
                  <TableCell>{siswa.kelasSaatIni}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ArrowUp className="h-4 w-4 text-primary" />
                      {siswa.kelasTujuan}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(siswa.status)}`}>
                      {siswa.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Detail Siswa",
                          description: `Menampilkan detail untuk ${siswa.nama}`,
                        });
                      }}
                    >
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Proses Kenaikan */}
      <Dialog open={showKenaikanDialog} onOpenChange={setShowKenaikanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Proses Kenaikan Kelas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Apakah Anda yakin ingin memproses kenaikan kelas untuk semua siswa yang berstatus "Naik"?</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowKenaikanDialog(false)}>
                Batal
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: "Kenaikan Kelas Berhasil",
                    description: "Proses kenaikan kelas telah berhasil dilakukan.",
                  });
                  setShowKenaikanDialog(false);
                }}
              >
                Proses
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}