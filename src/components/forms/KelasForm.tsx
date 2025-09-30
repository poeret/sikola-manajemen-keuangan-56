import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface KelasData {
  id?: string;
  nama: string;
  level: number;
  waliKelas: string;
  kapasitas: number;
  institution_id?: string;
}

interface InstitutionData {
  id: string;
  name: string;
}

interface KelasFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: KelasData) => void;
  initialData?: KelasData;
  mode: "create" | "edit";
  institutions?: InstitutionData[];
}

export function KelasForm({ open, onOpenChange, onSubmit, initialData, mode, institutions = [] }: KelasFormProps) {
  const [formData, setFormData] = useState<KelasData>({
    nama: "",
    level: 1,
    waliKelas: "",
    kapasitas: 0,
    institution_id: ""
  });


  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        nama: initialData.nama || "",
        level: initialData.level || 1,
        waliKelas: initialData.waliKelas || "",
        kapasitas: initialData.kapasitas || 0,
        institution_id: initialData.institution_id || "",
        ...(initialData.id && { id: initialData.id })
      });
    } else {
      setFormData({
        nama: "",
        level: 1,
        waliKelas: "",
        kapasitas: 0,
        institution_id: ""
      });
    }
  }, [initialData]);
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.waliKelas) {
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
      level: 1,
      waliKelas: "",
      kapasitas: 0
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
            <Label htmlFor="level">Level Kelas</Label>
            <Input
              id="level"
              type="number"
              min="1"
              max="12"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
              placeholder="1"
            />
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
            <Label htmlFor="kapasitas">Kapasitas Kelas</Label>
            <Input
              id="kapasitas"
              type="number"
              min="1"
              value={formData.kapasitas}
              onChange={(e) => setFormData({ ...formData, kapasitas: parseInt(e.target.value) || 0 })}
              placeholder="32"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="institution">Lembaga</Label>
            <Select 
              value={formData.institution_id} 
              onValueChange={(value) => setFormData({ ...formData, institution_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih lembaga" />
              </SelectTrigger>
              <SelectContent>
                {institutions.length > 0 ? (
                  institutions.map((institution) => (
                    <SelectItem key={institution.id} value={institution.id}>
                      {institution.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    Tidak ada lembaga tersedia
                  </SelectItem>
                )}
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