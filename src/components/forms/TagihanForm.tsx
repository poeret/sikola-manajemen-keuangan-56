import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface TagihanData {
  id?: string;
  kode: string;
  nama: string;
  nominal: number;
  kategori: string;
  status: string;
}

interface TagihanFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TagihanData) => void;
  initialData?: TagihanData;
  mode: "create" | "edit";
}

export function TagihanForm({ open, onOpenChange, onSubmit, initialData, mode }: TagihanFormProps) {
  const [formData, setFormData] = useState<TagihanData>({
    kode: initialData?.kode || "",
    nama: initialData?.nama || "",
    nominal: initialData?.nominal || 0,
    kategori: initialData?.kategori || "SPP",
    status: initialData?.status || "Aktif",
    ...(initialData?.id && { id: initialData.id })
  });
  
  const { toast } = useToast();

  // Sinkronkan form saat initialData berubah (misal ketika membuka Edit untuk item berbeda)
  useEffect(() => {
    if (open) {
      setFormData({
        kode: initialData?.kode || "",
        nama: initialData?.nama || "",
        nominal: initialData?.nominal || 0,
        kategori: initialData?.kategori || "SPP",
        status: initialData?.status || "Aktif",
        ...(initialData?.id && { id: initialData.id })
      });
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.kode || !formData.nama || formData.nominal <= 0) {
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
      kode: "",
      nama: "",
      nominal: 0,
      kategori: "SPP",
      status: "Aktif"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tambah Tagihan" : "Edit Tagihan"}
          </DialogTitle>
          <DialogDescription>Isi data tagihan kemudian simpan untuk menyimpan perubahan.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kode">Kode Tagihan</Label>
            <Input
              id="kode"
              value={formData.kode}
              onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
              placeholder="SPP-2024"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Tagihan</Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="SPP Bulanan"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nominal">Nominal</Label>
            <Input
              id="nominal"
              type="number"
              value={formData.nominal}
              onChange={(e) => setFormData({ ...formData, nominal: parseInt(e.target.value) || 0 })}
              placeholder="500000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kategori">Kategori</Label>
            <Select value={formData.kategori} onValueChange={(value) => setFormData({ ...formData, kategori: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SPP">SPP</SelectItem>
                <SelectItem value="Ujian">Ujian</SelectItem>
                <SelectItem value="Seragam">Seragam</SelectItem>
                <SelectItem value="Buku">Buku</SelectItem>
                <SelectItem value="Kegiatan">Kegiatan</SelectItem>
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