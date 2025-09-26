import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface KelasData {
  id?: number;
  nama: string;
  jurusan: string;
  waliKelas: string;
  jumlahSiswa: number;
}

interface KelasFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: KelasData) => void;
  initialData?: KelasData;
  mode: "create" | "edit";
}

export function KelasForm({ open, onOpenChange, onSubmit, initialData, mode }: KelasFormProps) {
  const [formData, setFormData] = useState<KelasData>({
    nama: initialData?.nama || "",
    jurusan: initialData?.jurusan || "",
    waliKelas: initialData?.waliKelas || "",
    jumlahSiswa: initialData?.jumlahSiswa || 0,
    ...(initialData?.id && { id: initialData.id })
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.jurusan || !formData.waliKelas) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang diperlukan",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formData);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      nama: "",
      jurusan: "",
      waliKelas: "",
      jumlahSiswa: 0
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tambah Kelas" : "Edit Kelas"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Kelas</Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="XII RPL 1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jurusan">Jurusan</Label>
            <Select value={formData.jurusan} onValueChange={(value) => setFormData({ ...formData, jurusan: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih jurusan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak</SelectItem>
                <SelectItem value="Teknik Komputer Jaringan">Teknik Komputer Jaringan</SelectItem>
                <SelectItem value="Multimedia">Multimedia</SelectItem>
                <SelectItem value="Akuntansi">Akuntansi</SelectItem>
                <SelectItem value="Administrasi Perkantoran">Administrasi Perkantoran</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="waliKelas">Wali Kelas</Label>
            <Input
              id="waliKelas"
              value={formData.waliKelas}
              onChange={(e) => setFormData({ ...formData, waliKelas: e.target.value })}
              placeholder="Budi Setiawan, S.Kom"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jumlahSiswa">Jumlah Siswa</Label>
            <Input
              id="jumlahSiswa"
              type="number"
              value={formData.jumlahSiswa}
              onChange={(e) => setFormData({ ...formData, jumlahSiswa: parseInt(e.target.value) || 0 })}
              placeholder="32"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">
              {mode === "create" ? "Tambah" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}