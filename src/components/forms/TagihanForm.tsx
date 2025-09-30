import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [kategoriOptions, setKategoriOptions] = useState<Array<{ id: string; name: string }>>([]);

  // Sinkronkan form saat initialData berubah (misal ketika membuka Edit untuk item berbeda)
  useEffect(() => {
    if (open) {
      setFormData({
        kode: initialData?.kode || "",
        nama: initialData?.nama || "",
        nominal: initialData?.nominal || 0,
        kategori: initialData?.kategori || "",
        status: initialData?.status || "Aktif",
        ...(initialData?.id && { id: initialData.id })
      });
    }
  }, [open, initialData]);

  // Load kategori dari master financial_categories (khusus type income)
  useEffect(() => {
    const loadKategori = async () => {
      try {
        const { data, error } = await supabase
          .from('financial_categories')
          .select('id, name, type, status')
          .eq('type', 'income')
          .in('status', ['active', 'Aktif']);
        if (!error) setKategoriOptions((data || []).map((d: any) => ({ id: d.id, name: d.name })));
      } catch {}
    };
    if (open) loadKategori();
  }, [open]);

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
            <Select value={formData.kategori || undefined} onValueChange={(value) => setFormData({ ...formData, kategori: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {kategoriOptions.length === 0 ? (
                  <SelectItem value="no-data" disabled>Tidak ada kategori</SelectItem>
                ) : (
                  kategoriOptions.map((opt) => (
                    <SelectItem key={opt.id} value={opt.name}>{opt.name}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground">
              Tidak menemukan kategori? Kelola di <a className="underline" href="/kategori-keuangan" target="_blank" rel="noreferrer">Kategori Keuangan</a>.
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