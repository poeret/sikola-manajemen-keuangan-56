import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderOpen, Plus, Search, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface KategoriKeuanganData {
  id: string;
  name: string;
  description: string | null;
  type: string;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export default function KategoriKeuangan() {
  const [searchQuery, setSearchQuery] = useState("");
  const [kategori, setKategori] = useState<KategoriKeuanganData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    jenis: "",
    deskripsi: ""
  });
  const { toast } = useToast();

  // Load data from database
  useEffect(() => {
    loadKategori();
  }, []);

  const loadKategori = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('financial_categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading financial categories:', error);
        toast({
          title: "Error",
          description: "Gagal memuat data kategori keuangan",
          variant: "destructive"
        });
        return;
      }

      setKategori(data || []);
    } catch (error) {
      console.error('Error loading financial categories:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data kategori keuangan",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getJenisColor = (jenis: string) => {
    return jenis === "income" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive";
  };

  const filteredKategori = kategori.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: newCategory, error } = await supabase
        .from('financial_categories')
        .insert({
          name: formData.nama,
          description: formData.deskripsi,
          type: formData.jenis as "income" | "expense",
          status: "active"
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating financial category:', error);
        toast({
          title: "Error",
          description: "Gagal menambahkan kategori",
          variant: "destructive"
        });
        return;
      }

      setKategori(prev => [newCategory, ...prev]);
      setFormData({ nama: "", jenis: "", deskripsi: "" });
      setShowAddDialog(false);
      toast({
        title: "Berhasil",
        description: "Kategori berhasil ditambahkan"
      });
    } catch (error) {
      console.error('Error creating financial category:', error);
      toast({
        title: "Error",
        description: "Gagal menambahkan kategori",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting financial category:', error);
        toast({
          title: "Error",
          description: "Gagal menghapus kategori",
          variant: "destructive"
        });
        return;
      }

      setKategori(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Berhasil",
        description: "Kategori berhasil dihapus"
      });
    } catch (error) {
      console.error('Error deleting financial category:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus kategori",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kategori Keuangan</h2>
          <p className="text-muted-foreground">
            Kelola kategori pemasukan dan pengeluaran
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kategori
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Daftar Kategori Keuangan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama Kategori</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : filteredKategori.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Tidak ada data kategori
                  </TableCell>
                </TableRow>
              ) : (
                filteredKategori.map((kategori) => (
                  <TableRow key={kategori.id}>
                    <TableCell className="font-medium">{kategori.id.slice(0, 8)}</TableCell>
                    <TableCell>{kategori.name}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getJenisColor(kategori.type)}`}>
                        {kategori.type === "income" ? "Pemasukan" : "Pengeluaran"}
                      </span>
                    </TableCell>
                    <TableCell>{kategori.description || "-"}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-success/10 text-success">
                        {kategori.status || "Aktif"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Edit Kategori",
                              description: `Mengedit kategori ${kategori.name}`,
                            });
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(kategori.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Tambah Kategori */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Keuangan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Kategori</Label>
              <Input
                id="nama"
                placeholder="Contoh: Penerimaan SPP"
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jenis">Jenis</Label>
              <Select value={formData.jenis} onValueChange={(value) => setFormData({...formData, jenis: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Pemasukan</SelectItem>
                  <SelectItem value="expense">Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                placeholder="Deskripsi kategori..."
                value={formData.deskripsi}
                onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Batal
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!formData.nama || !formData.jenis}
              >
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}