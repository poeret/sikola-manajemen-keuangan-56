import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { textSchema, sanitizeInput } from "@/lib/validation";

interface TahunAjaranData {
  id?: string;
  kode: string;
  deskripsi: string;
  status: string;
  tanggalMulai: string;
  tanggalSelesai: string;
}

interface TahunAjaranFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TahunAjaranData) => void;
  initialData?: TahunAjaranData;
  mode: "create" | "edit";
}

export function TahunAjaranForm({ open, onOpenChange, onSubmit, initialData, mode }: TahunAjaranFormProps) {
  const [formData, setFormData] = useState<TahunAjaranData>({
    kode: "",
    deskripsi: "",
    status: "Tidak Aktif",
    tanggalMulai: "",
    tanggalSelesai: ""
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        kode: initialData.kode || "",
        deskripsi: initialData.deskripsi || "",
        status: initialData.status || "Tidak Aktif",
        tanggalMulai: initialData.tanggalMulai || "",
        tanggalSelesai: initialData.tanggalSelesai || "",
        ...(initialData.id && { id: initialData.id })
      });
    } else {
      setFormData({
        kode: "",
        deskripsi: "",
        status: "Tidak Aktif",
        tanggalMulai: "",
        tanggalSelesai: ""
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
        kode: sanitizeInput(formData.kode),
        deskripsi: sanitizeInput(formData.deskripsi),
        status: sanitizeInput(formData.status)
      };

      // Validate inputs
      const validatedKode = textSchema.parse(sanitizedData.kode);
      const validatedDeskripsi = textSchema.parse(sanitizedData.deskripsi);

      onSubmit({
        ...sanitizedData,
        kode: validatedKode,
        deskripsi: validatedDeskripsi
      });
      onOpenChange(false);
      
      // Reset form
      setFormData({
        kode: "",
        deskripsi: "",
        status: "Tidak Aktif",
        tanggalMulai: "",
        tanggalSelesai: ""
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
            {mode === "create" ? "Tambah Tahun Ajaran Baru" : "Edit Tahun Ajaran"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kode">Kode Tahun Ajaran *</Label>
            <Input
              id="kode"
              value={formData.kode}
              onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
              placeholder="Contoh: TA2024"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi *</Label>
            <Input
              id="deskripsi"
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              placeholder="Tahun Ajaran 2024/2025"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tanggalMulai">Tanggal Mulai *</Label>
              <Input
                id="tanggalMulai"
                type="date"
                value={formData.tanggalMulai}
                onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tanggalSelesai">Tanggal Selesai *</Label>
              <Input
                id="tanggalSelesai"
                type="date"
                value={formData.tanggalSelesai}
                onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
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
                <SelectItem value="Aktif">Aktif</SelectItem>
                <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
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
