import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Receipt, Plus, Search, Edit, Trash2 } from "lucide-react";
import { TagihanForm } from "@/components/forms/TagihanForm";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
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

interface TagihanData {
  id: string;
  name: string;
  code: string;
  amount: number;
  category: string;
  due_date: string | null;
  status: string | null;
  academic_year_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export default function Tagihan() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tagihan, setTagihan] = useState<TagihanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedTagihan, setSelectedTagihan] = useState<TagihanData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tagihanToDelete, setTagihanToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Load data from database
  useEffect(() => {
    loadTagihan();
  }, []);

  const loadTagihan = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading bills:', error);
        toast({
          title: "Error",
          description: "Gagal memuat data tagihan",
          variant: "destructive"
        });
        return;
      }

      setTagihan(data || []);
    } catch (error) {
      console.error('Error loading bills:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data tagihan",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTagihan = tagihan.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedTagihan(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (item: TagihanData) => {
    setSelectedTagihan(item);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setTagihanToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (tagihanToDelete) {
      try {
        const { error } = await supabase
          .from('bills')
          .delete()
          .eq('id', tagihanToDelete);

        if (error) {
          console.error('Error deleting bill:', error);
          toast({
            title: "Error",
            description: "Gagal menghapus tagihan",
            variant: "destructive"
          });
          return;
        }

        setTagihan(prev => prev.filter(item => item.id !== tagihanToDelete));
        toast({
          title: "Berhasil",
          description: "Tagihan berhasil dihapus"
        });
      } catch (error) {
        console.error('Error deleting bill:', error);
        toast({
          title: "Error",
          description: "Gagal menghapus tagihan",
          variant: "destructive"
        });
      }
    }
    setDeleteDialogOpen(false);
    setTagihanToDelete(null);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (formMode === "create") {
        const { data: newBill, error } = await supabase
          .from('bills')
          .insert({
            name: data.nama,
            code: data.kode,
            amount: data.nominal,
            category: data.kategori,
            status: "pending"
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating bill:', error);
          toast({
            title: "Error",
            description: "Gagal menambahkan tagihan",
            variant: "destructive"
          });
          return;
        }

        setTagihan(prev => [newBill, ...prev]);
        toast({
          title: "Berhasil",
          description: "Tagihan berhasil ditambahkan"
        });
      } else {
        const { data: updatedBill, error } = await supabase
          .from('bills')
          .update({
            name: data.nama,
            code: data.kode,
            amount: data.nominal,
            category: data.kategori,
            status: data.status
          })
          .eq('id', selectedTagihan?.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating bill:', error);
          toast({
            title: "Error",
            description: "Gagal memperbarui tagihan",
            variant: "destructive"
          });
          return;
        }

        setTagihan(prev => prev.map(item => 
          item.id === selectedTagihan?.id ? updatedBill : item
        ));
        toast({
          title: "Berhasil",
          description: "Tagihan berhasil diperbarui"
        });
      }
    } catch (error) {
      console.error('Error saving bill:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan tagihan",
        variant: "destructive"
      });
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Data Tagihan</h2>
          <p className="text-muted-foreground">
            Kelola jenis tagihan dan nominal pembayaran
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Tagihan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Daftar Tagihan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari tagihan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama Tagihan</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Kategori</TableHead>
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
              ) : filteredTagihan.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Tidak ada data tagihan
                  </TableCell>
                </TableRow>
              ) : (
                filteredTagihan.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>Rp {item.amount.toLocaleString('id-ID')}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-success/10 text-success">
                        {item.status || "Pending"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
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

      <TagihanForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedTagihan ? {
          id: selectedTagihan.id,
          nama: selectedTagihan.name,
          kode: selectedTagihan.code,
          nominal: selectedTagihan.amount,
          kategori: selectedTagihan.category,
          status: selectedTagihan.status || "pending"
        } : undefined}
        mode={formMode}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Hapus Tagihan"
        description="Apakah Anda yakin ingin menghapus tagihan ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={confirmDelete}
      />
    </div>
  );
}