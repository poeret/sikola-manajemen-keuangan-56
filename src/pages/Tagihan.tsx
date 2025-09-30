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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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

  // Assign Massal state
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignBill, setAssignBill] = useState<TagihanData | null>(null);
  const [assignTarget, setAssignTarget] = useState<"semua" | "kelas">("semua");
  const [classes, setClasses] = useState<{ id: string; name: string; level: number }[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [academicYears, setAcademicYears] = useState<Array<{ id: string; code: string; description: string }>>([]);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string>("");
  // Generator bulanan
  const [repeatMonthly, setRepeatMonthly] = useState<boolean>(false);
  const [monthsCount, setMonthsCount] = useState<number>(12);
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    const iso = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0,10);
    return iso;
  });
  const [overwriteExisting, setOverwriteExisting] = useState<boolean>(false);
  // Bill monthly eligibility (show/hide Kelola Bulanan)
  const [monthlyEligible, setMonthlyEligible] = useState<Record<string, boolean>>({});

  // Kelola bulanan (edit per bulan di TA aktif)
  const [manageOpen, setManageOpen] = useState(false);
  const [manageBill, setManageBill] = useState<TagihanData | null>(null);
  const [manageTarget, setManageTarget] = useState<"all" | "kelas">("all");
  const [manageLevel, setManageLevel] = useState<number | "_all">("_all");
  const [manageClassId, setManageClassId] = useState<string>("_all");
  const [manageRows, setManageRows] = useState<Array<{ due_date: string; amount: number }>>([]);
  const [manageLoading, setManageLoading] = useState(false);
  const [manageSaving, setManageSaving] = useState(false);

  // Load data from database
  useEffect(() => {
    loadTagihan();
    loadClasses();
    loadAcademicYears();
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

      const list = data || [];
      setTagihan(list);
      void computeMonthlyEligibility(list);
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

  const computeMonthlyEligibility = async (billsList: TagihanData[]) => {
    try {
      const billIds = billsList.map(b => b.id);
      if (billIds.length === 0) { setMonthlyEligible({}); return; }
      // get active academic year range
      const { data: ay } = await supabase
        .from('academic_years')
        .select('start_date, end_date, is_active')
        .eq('is_active', true)
        .limit(1)
        .single();
      let minDate: string | null = ay?.start_date || null;
      let maxDate: string | null = ay?.end_date || null;
      let q = supabase
        .from('student_bills')
        .select('bill_id, due_date')
        .in('bill_id', billIds);
      if (minDate && maxDate) q = q.gte('due_date', minDate).lte('due_date', maxDate);
      const { data } = await q;
      const map: Record<string, Set<string>> = {};
      (data || []).forEach((r: any) => {
        const ym = r.due_date ? String(r.due_date).slice(0,7) : '';
        if (!ym) return;
        if (!map[r.bill_id]) map[r.bill_id] = new Set();
        map[r.bill_id].add(ym);
      });
      const elig: Record<string, boolean> = {};
      billIds.forEach(id => { elig[id] = (map[id]?.size || 0) >= 2; });
      setMonthlyEligible(elig);
    } catch {
      // silent
    }
  };

  const loadClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('id, name, level')
        .order('level', { ascending: true })
        .order('name', { ascending: true });
      if (error) return;
      setClasses(data || []);
    } catch (e) {
      // ignore
    }
  };

  const loadAcademicYears = async () => {
    try {
      const { data, error } = await supabase
        .from('academic_years')
        .select('id, code, description')
        .order('start_date', { ascending: false });
      if (!error) setAcademicYears(data as any || []);
    } catch {}
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

  const openAssign = (item: TagihanData) => {
    setAssignBill(item);
    setAssignTarget("semua");
    setSelectedClassId("");
    setAssignOpen(true);
    setRepeatMonthly(false);
    setMonthsCount(12);
    const d = new Date();
    setStartDate(new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0,10));
    setOverwriteExisting(false);
  };

  const openManage = (item: TagihanData) => {
    setManageBill(item);
    setManageTarget("all");
    setManageLevel("_all");
    setManageClassId("_all");
    setManageRows([]);
    setManageOpen(true);
    void loadManageRows(item.id, "_all");
  };

  const loadManageRows = async (billId: string, classId: string) => {
    try {
      setManageLoading(true);
      // Ambil TA aktif untuk rentang tanggal
      const { data: ay } = await supabase.from('academic_years').select('id, start_date, end_date, is_active').eq('is_active', true).limit(1).single();
      let minDate = null as string | null;
      let maxDate = null as string | null;
      if (ay) {
        minDate = ay.start_date;
        maxDate = ay.end_date;
      }
      // Bentuk daftar bulan TA aktif (default untuk kasus berulang)
      const months: string[] = [];
      if (minDate && maxDate) {
        const start = new Date(minDate);
        const end = new Date(maxDate);
        const fmt = (y: number, m: number) => `${y}-${String(m + 1).padStart(2, '0')}-01`;
        for (let y = start.getFullYear(), m = start.getMonth(); y < end.getFullYear() || (y === end.getFullYear() && m <= end.getMonth()); ) {
          months.push(fmt(y, m));
          m++;
          if (m > 11) { m = 0; y++; }
        }
      }
      // Ambil daftar due_date yang ada pada TA aktif untuk bill ini (mencakup berulang maupun tidak)
      let amountsByMonth: Record<string, number> = {};
      let existingDates: string[] = [];
      if (minDate && maxDate) {
        const { data, error } = await supabase
          .from('student_bills')
          .select('amount, due_date')
          .eq('bill_id', billId)
          .gte('due_date', minDate)
          .lte('due_date', maxDate)
          .order('due_date', { ascending: true });
        if (!error) {
          const byDate: Record<string, Record<number, number>> = {};
          (data || []).forEach((r: any) => {
            if (!r.due_date) return;
            const date = r.due_date as string;
            const amt = Number(r.amount) || 0;
            byDate[date] ||= {};
            byDate[date][amt] = (byDate[date][amt] || 0) + 1;
          });
          existingDates = Object.keys(byDate).sort();
          Object.entries(byDate).forEach(([date, counts]) => {
            let bestAmt = 0; let bestCnt = -1;
            Object.entries(counts).forEach(([amtStr, cnt]) => {
              const amt = Number(amtStr);
              if (cnt > bestCnt) { bestCnt = cnt; bestAmt = amt; }
            });
            amountsByMonth[date] = bestAmt;
          });
        }
      }
      const defaultAmount = manageBill?.amount || 0;
      // Gunakan existingDates jika ada (untuk kasus tidak berulang), kalau tidak gunakan seluruh bulan TA
      const datesSource = existingDates.length > 0 ? existingDates : months;
      const rows = datesSource.map((d) => ({ due_date: d, amount: amountsByMonth[d] ?? defaultAmount }));
      setManageRows(rows);
    } catch (e) {
      console.error('Error loading monthly bills:', e);
      toast({ title: 'Error', description: 'Gagal memuat tagihan bulanan', variant: 'destructive' });
    } finally {
      setManageLoading(false);
    }
  };

  const saveManageChanges = async () => {
    try {
      setManageSaving(true);
      // Target siswa: semua atau per kelas
      let targetStudentIds: string[] | null = null;
      if (manageTarget === 'kelas' && manageClassId && manageClassId !== '_all') {
        const { data: studs, error: studErr } = await supabase.from('students').select('id').eq('class_id', manageClassId);
        if (studErr) throw studErr;
        targetStudentIds = (studs || []).map((s: any) => s.id);
      }
      // Update per bulan
      for (const row of manageRows) {
        let q = supabase.from('student_bills').update({ amount: row.amount }).eq('bill_id', manageBill?.id as any).eq('due_date', row.due_date);
        if (targetStudentIds) {
          if (targetStudentIds.length === 0) continue;
          q = q.in('student_id', targetStudentIds);
        }
        const { error } = await q;
        if (error) throw error;
      }
      toast({ title: 'Berhasil', description: 'Perubahan nominal berhasil disimpan' });
      setManageOpen(false);
    } catch (e) {
      console.error('Error saving monthly bills:', e);
      toast({ title: 'Error', description: 'Gagal menyimpan perubahan', variant: 'destructive' });
    } finally {
      setManageSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    setTagihanToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleAssignConfirm = async () => {
    if (!assignBill) return;
    try {
      setAssignLoading(true);
      // 1) Ambil siswa target
      let studentQuery = supabase
        .from('students')
        .select('id');
      if (assignTarget === 'kelas' && selectedClassId) {
        studentQuery = studentQuery.eq('class_id', selectedClassId);
      }
      const { data: students, error: studentsErr } = await studentQuery;
      if (studentsErr) throw studentsErr;
      const targetStudentIds = (students || []).map((s: any) => s.id);
      if (targetStudentIds.length === 0) {
        toast({ title: "Info", description: "Tidak ada siswa pada target yang dipilih" });
        return;
      }

      // 2) Bentuk daftar due date (bulanan atau tunggal)
      const start = new Date(startDate);
      const months: string[] = [];
      const fmt = (y: number, m: number, day: number = 1) => {
        const mm = String(m + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        return `${y}-${mm}-${dd}`;
      };
      const total = repeatMonthly ? Math.max(1, Math.min(24, monthsCount)) : 1;
      for (let i = 0; i < total; i++) {
        const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
        months.push(fmt(d.getFullYear(), d.getMonth(), 1));
      }

      // 3) Ambil existing student_bills untuk rentang bulan ini
      const minDate = months[0];
      const maxDate = months[months.length - 1];
      const { data: existing, error: existErr } = await supabase
        .from('student_bills')
        .select('id, student_id, due_date')
        .eq('bill_id', assignBill.id)
        .in('student_id', targetStudentIds)
        .gte('due_date', minDate)
        .lte('due_date', maxDate);
      if (existErr) throw existErr;
      const existingMap = new Map<string, any>(); // key: studentId-YYYY-MM
      (existing || []).forEach((row: any) => {
        const ym = row.due_date ? row.due_date.slice(0,7) : '';
        existingMap.set(`${row.student_id}-${ym}`, row);
      });

      // 4) Susun insert & update
      const toInsert: any[] = [];
      const toUpdate: { id: string; amount: number; due_date: string }[] = [];
      for (const sid of targetStudentIds) {
        for (const m of months) {
          const ym = m.slice(0,7);
          const key = `${sid}-${ym}`;
          const found = existingMap.get(key);
          if (found) {
            if (overwriteExisting) {
              toUpdate.push({ id: found.id, amount: assignBill.amount, due_date: m });
            }
          } else {
            toInsert.push({
              student_id: sid,
              bill_id: assignBill.id,
              amount: assignBill.amount,
              due_date: m,
              status: 'pending',
            });
          }
        }
      }

      // Early exit info jika tidak ada perubahan yang perlu dilakukan
      if (toInsert.length === 0 && toUpdate.length === 0) {
        toast({ title: "Info", description: "Semua tagihan untuk periode tersebut sudah ditetapkan" });
        setAssignOpen(false);
        return;
      }

      if (toInsert.length > 0) {
        // Lakukan insert dalam batch agar request tidak terlalu besar
        const chunkSize = 500;
        for (let i = 0; i < toInsert.length; i += chunkSize) {
          const chunk = toInsert.slice(i, i + chunkSize);
          const { error: insertErr } = await supabase.from('student_bills').insert(chunk);
          if (insertErr) throw insertErr;
        }
      }
      if (toUpdate.length > 0) {
        // lakukan update satu per satu agar sederhana
        for (const row of toUpdate) {
          const { error: updErr } = await supabase
            .from('student_bills')
            .update({ amount: row.amount, due_date: row.due_date, status: 'pending' })
            .eq('id', row.id);
          if (updErr) throw updErr;
        }
      }

      const affected = toInsert.length + toUpdate.length;
      toast({ title: "Berhasil", description: `Berhasil menetapkan ${affected} tagihan bulanan` });
      setAssignOpen(false);
    } catch (error) {
      console.error('Error assigning bills:', error);
      toast({ title: "Error", description: "Gagal menetapkan tagihan", variant: "destructive" });
    } finally {
      setAssignLoading(false);
    }
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
                        <Button variant="ghost" size="sm" onClick={() => openAssign(item)}>
                          Tetapkan
                        </Button>
                        {monthlyEligible[item.id] && (
                          <Button variant="ghost" size="sm" onClick={() => openManage(item)}>
                            Kelola Bulanan
                          </Button>
                        )}
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

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tetapkan Tagihan</DialogTitle>
            <DialogDescription>Pilih target dan opsi pengulangan untuk menetapkan tagihan ke siswa.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Pilih Target</Label>
              <Select value={assignTarget} onValueChange={(v: any) => setAssignTarget(v)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Pilih target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Siswa</SelectItem>
                  <SelectItem value="kelas">Per Kelas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tahun Ajaran</Label>
              <Select value={selectedAcademicYearId} onValueChange={setSelectedAcademicYearId}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Pilih tahun ajaran (opsional)" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((y) => (
                    <SelectItem key={y.id} value={y.id}>{y.code} - {y.description}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {assignTarget === 'kelas' && (
              <div>
                <Label>Pilih Kelas</Label>
                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.level}. {c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox id="repeatMonthly" checked={repeatMonthly} onCheckedChange={(v) => setRepeatMonthly(!!v)} />
                <Label htmlFor="repeatMonthly">Ulangi bulanan</Label>
              </div>
              {repeatMonthly && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label>Tanggal mulai</Label>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Jumlah bulan</Label>
                    <Input type="number" min={1} max={24} value={monthsCount} onChange={(e) => setMonthsCount(parseInt(e.target.value) || 1)} />
                  </div>
                  <div className="flex items-end">
                    <div className="flex items-center gap-2">
                      <Checkbox id="overwriteExisting" checked={overwriteExisting} onCheckedChange={(v) => setOverwriteExisting(!!v)} />
                      <Label htmlFor="overwriteExisting">Timpa jika sudah ada</Label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setAssignOpen(false)}>Batal</Button>
              <Button onClick={handleAssignConfirm} disabled={assignLoading || (assignTarget === 'kelas' && !selectedClassId)}>
                {assignLoading ? 'Memproses...' : 'Tetapkan'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Monthly Bills Dialog */}
      <Dialog open={manageOpen} onOpenChange={setManageOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Kelola Tagihan Bulanan (TA berjalan)</DialogTitle>
            <DialogDescription>Ubah nominal per bulan untuk siswa pada Tahun Ajaran aktif.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label>Bill</Label>
                <div className="mt-2 text-sm font-medium">{manageBill?.name} ({manageBill?.code})</div>
              </div>
              <div>
                <Label>Target</Label>
                <Select value={manageTarget} onValueChange={(v: any) => setManageTarget(v)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Pilih target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua siswa</SelectItem>
                    <SelectItem value="kelas">Per Kelas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {manageTarget === 'kelas' && (
                <>
                  <div>
                    <Label>Level</Label>
                    <Select value={String(manageLevel)} onValueChange={(v) => setManageLevel(v === '_all' ? '_all' : parseInt(v))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Semua level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_all">Semua level</SelectItem>
                        {[...new Set(classes.map(c => c.level))].map((lvl) => (
                          <SelectItem key={lvl} value={String(lvl)}>{lvl}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Kelas</Label>
                    <Select value={manageClassId} onValueChange={(v) => { setManageClassId(v); if (manageBill) void loadManageRows(manageBill.id, v); }}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Semua kelas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_all">Semua kelas</SelectItem>
                        {classes.filter(c => manageLevel === '_all' || c.level === manageLevel).map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.level}. {c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
            <div className="border rounded-md max-h-[60vh] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Periode</TableHead>
                    <TableHead>Nominal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manageLoading ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-6">Memuat...</TableCell></TableRow>
                  ) : manageRows.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-6">Tidak ada data</TableCell></TableRow>
                  ) : (
                    manageRows.map((r, idx) => (
                      <TableRow key={r.due_date}>
                        <TableCell>{new Date(r.due_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}</TableCell>
                        <TableCell>
                          <Input type="number" value={r.amount} onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setManageRows(prev => prev.map((x, i) => i === idx ? { ...x, amount: val } : x));
                          }} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end gap-2 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t pt-3">
              <Button variant="outline" onClick={() => setManageOpen(false)}>Batal</Button>
              <Button onClick={saveManageChanges} disabled={manageSaving || manageLoading}>{manageSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}