import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { nameSchema, sanitizeInput } from "@/lib/validation";

interface KenaikanKelasData {
  id?: number;
  nis: string;
  nama: string;
  kelasSaatIni: string;
  kelasTujuan: string;
  status: string;
}

interface KenaikanKelasFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: KenaikanKelasData) => void;
  initialData?: KenaikanKelasData;
  mode: "create" | "edit";
}

export function KenaikanKelasForm({ open, onOpenChange, onSubmit, initialData, mode }: KenaikanKelasFormProps) {
  const [formData, setFormData] = useState<KenaikanKelasData>({
    nis: initialData?.nis || "",
    nama: initialData?.nama || "",
    kelasSaatIni: initialData?.kelasSaatIni || "",
    kelasTujuan: initialData?.kelasTujuan || "",
    status: initialData?.status || "Pending",
    ...(initialData?.id && { id: initialData.id })
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Sanitize inputs
      const sanitizedData = {
        ...formData,
        nis: sanitizeInput(formData.nis),
        nama: sanitizeInput(formData.nama),
        kelasSaatIni: sanitizeInput(formData.kelasSaatIni),
        kelasTujuan: sanitizeInput(formData.kelasTujuan),
        status: sanitizeInput(formData.status)
      };

      // Validate inputs
      const validatedName = nameSchema.parse(sanitizedData.nama);

      onSubmit({
        ...sanitizedData,
        nama: validatedName
      });
      onOpenChange(false);
      
      // Reset form
      setFormData({
        nis: "",
        nama: "",
        kelasSaatIni: "",
        kelasTujuan: "",
        status: "Pending"
      });
    } catch (error: any) {
      toast({
        title: "Error Validasi",
        description: error.message || "Data tidak valid",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tambah Data Kenaikan Kelas" : "Edit Data Kenaikan Kelas"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nis">NIS *</Label>
              <Input
                id="nis"
                value={formData.nis}
                onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                placeholder="Nomor Induk Siswa"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Siswa *</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Nama lengkap siswa"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kelasSaatIni">Kelas Saat Ini *</Label>
              <Select value={formData.kelasSaatIni} onValueChange={(value) => setFormData({ ...formData, kelasSaatIni: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kelas saat ini" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="X RPL 1">X RPL 1</SelectItem>
                  <SelectItem value="X RPL 2">X RPL 2</SelectItem>
                  <SelectItem value="XI RPL 1">XI RPL 1</SelectItem>
                  <SelectItem value="XI RPL 2">XI RPL 2</SelectItem>
                  <SelectItem value="XII RPL 1">XII RPL 1</SelectItem>
                  <SelectItem value="XII RPL 2">XII RPL 2</SelectItem>
                  <SelectItem value="X TKJ 1">X TKJ 1</SelectItem>
                  <SelectItem value="X TKJ 2">X TKJ 2</SelectItem>
                  <SelectItem value="XI TKJ 1">XI TKJ 1</SelectItem>
                  <SelectItem value="XI TKJ 2">XI TKJ 2</SelectItem>
                  <SelectItem value="XII TKJ 1">XII TKJ 1</SelectItem>
                  <SelectItem value="XII TKJ 2">XII TKJ 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="kelasTujuan">Kelas Tujuan *</Label>
              <Select value={formData.kelasTujuan} onValueChange={(value) => setFormData({ ...formData, kelasTujuan: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kelas tujuan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XI RPL 1">XI RPL 1</SelectItem>
                  <SelectItem value="XI RPL 2">XI RPL 2</SelectItem>
                  <SelectItem value="XII RPL 1">XII RPL 1</SelectItem>
                  <SelectItem value="XII RPL 2">XII RPL 2</SelectItem>
                  <SelectItem value="XI TKJ 1">XI TKJ 1</SelectItem>
                  <SelectItem value="XI TKJ 2">XI TKJ 2</SelectItem>
                  <SelectItem value="XII TKJ 1">XII TKJ 1</SelectItem>
                  <SelectItem value="XII TKJ 2">XII TKJ 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Naik">Naik</SelectItem>
                <SelectItem value="Tinggal Kelas">Tinggal Kelas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
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
