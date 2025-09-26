import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface LembagaData {
  id?: number;
  nama: string;
  alamat: string;
  kepala: string;
  status: string;
}

interface LembagaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: LembagaData) => void;
  initialData?: LembagaData;
  mode: "create" | "edit";
}

export function LembagaForm({ open, onOpenChange, onSubmit, initialData, mode }: LembagaFormProps) {
  const [formData, setFormData] = useState<LembagaData>({
    nama: initialData?.nama || "",
    alamat: initialData?.alamat || "",
    kepala: initialData?.kepala || "",
    status: initialData?.status || "Aktif",
    ...(initialData?.id && { id: initialData.id })
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.alamat || !formData.kepala) {
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
      alamat: "",
      kepala: "",
      status: "Aktif"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tambah Lembaga" : "Edit Lembaga"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Lembaga</Label>
            <Input
              id="nama"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="SMK Negeri 1 Jakarta"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat</Label>
            <Textarea
              id="alamat"
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              placeholder="Jl. Pendidikan No. 123"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kepala">Kepala Sekolah</Label>
            <Input
              id="kepala"
              value={formData.kepala}
              onChange={(e) => setFormData({ ...formData, kepala: e.target.value })}
              placeholder="Dr. Soekarno, M.Pd"
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