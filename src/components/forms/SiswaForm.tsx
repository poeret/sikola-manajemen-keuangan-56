import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { nameSchema, sanitizeInput } from "@/lib/validation";

interface SiswaData {
  id?: string;
  nis: string;
  nama: string;
  jenisKelamin: string;
  tanggalLahir: string;
  tempatLahir: string;
  alamat: string;
  telepon: string;
  namaOrtu: string;
  teleponOrtu: string;
  status: string;
}

interface SiswaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SiswaData) => void;
  initialData?: SiswaData;
  mode: "create" | "edit";
}

export function SiswaForm({ open, onOpenChange, onSubmit, initialData, mode }: SiswaFormProps) {
  const [formData, setFormData] = useState<SiswaData>({
    nis: "",
    nama: "",
    jenisKelamin: "",
    tanggalLahir: "",
    tempatLahir: "",
    alamat: "",
    telepon: "",
    namaOrtu: "",
    teleponOrtu: "",
    status: "active"
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        nis: initialData.nis || "",
        nama: initialData.nama || "",
        jenisKelamin: initialData.jenisKelamin || "",
        tanggalLahir: initialData.tanggalLahir || "",
        tempatLahir: initialData.tempatLahir || "",
        alamat: initialData.alamat || "",
        telepon: initialData.telepon || "",
        namaOrtu: initialData.namaOrtu || "",
        teleponOrtu: initialData.teleponOrtu || "",
        status: initialData.status || "active",
        ...(initialData.id && { id: initialData.id })
      });
    } else {
      setFormData({
        nis: "",
        nama: "",
        jenisKelamin: "",
        tanggalLahir: "",
        tempatLahir: "",
        alamat: "",
        telepon: "",
        namaOrtu: "",
        teleponOrtu: "",
        status: "active"
      });
    }
  }, [initialData]);
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Sanitize inputs
      const sanitizedData = {
        ...formData,
        nis: sanitizeInput(formData.nis),
        nama: sanitizeInput(formData.nama),
        jenisKelamin: sanitizeInput(formData.jenisKelamin),
        tanggalLahir: sanitizeInput(formData.tanggalLahir),
        tempatLahir: sanitizeInput(formData.tempatLahir),
        alamat: sanitizeInput(formData.alamat),
        telepon: sanitizeInput(formData.telepon),
        namaOrtu: sanitizeInput(formData.namaOrtu),
        teleponOrtu: sanitizeInput(formData.teleponOrtu),
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
        jenisKelamin: "",
        tanggalLahir: "",
        tempatLahir: "",
        alamat: "",
        telepon: "",
        namaOrtu: "",
        teleponOrtu: "",
        status: "active"
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tambah Siswa Baru" : "Edit Data Siswa"}
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
              <Label htmlFor="nama">Nama Lengkap *</Label>
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
              <Label htmlFor="jenisKelamin">Jenis Kelamin *</Label>
              <Select value={formData.jenisKelamin} onValueChange={(value) => setFormData({ ...formData, jenisKelamin: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tanggalLahir">Tanggal Lahir *</Label>
              <Input
                id="tanggalLahir"
                type="date"
                value={formData.tanggalLahir}
                onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tempatLahir">Tempat Lahir *</Label>
              <Input
                id="tempatLahir"
                value={formData.tempatLahir}
                onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                placeholder="Jakarta"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telepon">Telepon</Label>
              <Input
                id="telepon"
                value={formData.telepon}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                placeholder="08123456789"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat *</Label>
            <Input
              id="alamat"
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              placeholder="Alamat lengkap"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="namaOrtu">Nama Orang Tua *</Label>
              <Input
                id="namaOrtu"
                value={formData.namaOrtu}
                onChange={(e) => setFormData({ ...formData, namaOrtu: e.target.value })}
                placeholder="Nama orang tua"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teleponOrtu">Telepon Orang Tua *</Label>
              <Input
                id="teleponOrtu"
                value={formData.teleponOrtu}
                onChange={(e) => setFormData({ ...formData, teleponOrtu: e.target.value })}
                placeholder="Nomor telepon orang tua"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
                <SelectItem value="graduated">Lulus</SelectItem>
                <SelectItem value="dropped_out">Drop Out</SelectItem>
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
