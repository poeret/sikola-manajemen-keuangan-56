import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface KeuanganData {
  id?: number;
  nama: string;
  deskripsi: string;
  tipe: string;
  status: string;
}

interface KeuanganFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: KeuanganData) => void;
  initialData?: KeuanganData;
  mode: "create" | "edit";
}

export function KeuanganForm({ open, onOpenChange, onSubmit, initialData, mode }: KeuanganFormProps) {
  const [formData, setFormData] = useState<KeuanganData>({
    nama: initialData?.nama || "",
    deskripsi: initialData?.deskripsi || "",
    tipe: initialData?.tipe || "Pemasukan",
    status: initialData?.status || "Aktif",
    ...(initialData?.id && { id: initialData.id })
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.deskripsi || !formData.tipe) {
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
      deskripsi: "",
      tipe: "Pemasukan",
      status: "Aktif"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tambah Kategori Keuangan" : "Edit Kategori Keuangan"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Kategori</Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Biaya Operasional"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              placeholder="Biaya untuk operasional sekolah"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipe">Tipe</Label>
            <Select value={formData.tipe} onValueChange={(value) => setFormData({ ...formData, tipe: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pemasukan">Pemasukan</SelectItem>
                <SelectItem value="Pengeluaran">Pengeluaran</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aktif">Aktif</SelectItem>
                <SelectItem value="Nonaktif">Nonaktif</SelectItem>
              </SelectContent>
            </Select>
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