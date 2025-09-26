import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface BeasiswaData {
  id?: number;
  nama: string;
  deskripsi: string;
  persentasePotongan: number;
  status: string;
}

interface BeasiswaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BeasiswaData) => void;
  initialData?: BeasiswaData;
  mode: "create" | "edit";
}

export function BeasiswaForm({ open, onOpenChange, onSubmit, initialData, mode }: BeasiswaFormProps) {
  const [formData, setFormData] = useState<BeasiswaData>({
    nama: initialData?.nama || "",
    deskripsi: initialData?.deskripsi || "",
    persentasePotongan: initialData?.persentasePotongan || 0,
    status: initialData?.status || "Aktif",
    ...(initialData?.id && { id: initialData.id })
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.deskripsi || formData.persentasePotongan <= 0 || formData.persentasePotongan > 100) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field dan pastikan persentase antara 1-100%",
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
      persentasePotongan: 0,
      status: "Aktif"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tambah Kategori Beasiswa" : "Edit Kategori Beasiswa"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Kategori</Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Beasiswa Prestasi"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              placeholder="Untuk siswa berprestasi akademik"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="persentasePotongan">Persentase Potongan (%)</Label>
            <Input
              id="persentasePotongan"
              type="number"
              min="1"
              max="100"
              value={formData.persentasePotongan}
              onChange={(e) => setFormData({ ...formData, persentasePotongan: parseInt(e.target.value) || 0 })}
              placeholder="50"
            />
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