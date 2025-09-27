import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { emailSchema, nameSchema, phoneSchema, sanitizeInput, sanitizeEmail } from "@/lib/validation";

interface PenggunaData {
  id?: string;
  name: string;
  email: string;
  role: string;
  status: string;
  is_active?: boolean;
}

interface PenggunaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PenggunaData) => void;
  initialData?: PenggunaData;
  mode: "create" | "edit";
}

export function PenggunaForm({ open, onOpenChange, onSubmit, initialData, mode }: PenggunaFormProps) {
  const [formData, setFormData] = useState<PenggunaData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    role: initialData?.role || "cashier",
    status: initialData?.status || "Aktif",
    ...(initialData?.id && { id: initialData.id })
  });
  
  const { toast } = useToast();

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        role: initialData.role || "cashier",
        status: initialData.is_active ? "Aktif" : "Nonaktif",
        ...(initialData.id && { id: initialData.id })
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Sanitize inputs
      const sanitizedData = {
        ...formData,
        name: sanitizeInput(formData.name),
        email: sanitizeEmail(formData.email),
        role: sanitizeInput(formData.role),
        status: sanitizeInput(formData.status)
      };

      // Validate inputs
      const validatedName = nameSchema.parse(sanitizedData.name);
      const validatedEmail = emailSchema.parse(sanitizedData.email);

      onSubmit({
        ...sanitizedData,
        name: validatedName,
        email: validatedEmail
      });
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        role: "cashier",
        status: "Aktif"
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tambah Pengguna" : "Edit Pengguna"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john.doe@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="cashier">Kasir</SelectItem>
                <SelectItem value="teacher">Guru</SelectItem>
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