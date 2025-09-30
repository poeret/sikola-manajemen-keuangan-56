import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, Search, ArrowUp, CheckCircle, Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { KenaikanKelasForm } from "@/components/forms/KenaikanKelasForm";
import { supabase } from "@/integrations/supabase/client";

// Data mock lama masih dipertahankan untuk tabel bawah; namun proses utama kini via Supabase
const mockKenaikan: any[] = [];

interface Institution { id: string; name: string }
interface ClassRow { id: string; name: string; level: number; institution_id: string }
interface AcademicYear { id: string; code: string; description: string }

export default function KenaikanKelas() {
  const [searchQuery, setSearchQuery] = useState("");
  const [kenaikan, setKenaikan] = useState(mockKenaikan);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedKenaikan, setSelectedKenaikan] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [kenaikanToDelete, setKenaikanToDelete] = useState<number | null>(null);
  const [showKenaikanDialog, setShowKenaikanDialog] = useState(false);
  const { toast } = useToast();

  // Filters & data
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>("");
  const [fromClassId, setFromClassId] = useState<string>("");
  const [toClassId, setToClassId] = useState<string>("");
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string>(""); // digunakan sebagai info filter opsional
  const [sourceAcademicYearId, setSourceAcademicYearId] = useState<string>("");
  const [targetAcademicYearId, setTargetAcademicYearId] = useState<string>("");
  const [graduationMode, setGraduationMode] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);

  useEffect(() => {
    loadInstitutions();
    loadClasses();
    loadAcademicYears();
  }, []);

  const loadInstitutions = async () => {
    try {
      const { data, error } = await supabase.from('institutions').select('id, name').order('name', { ascending: true });
      if (!error) setInstitutions(data || []);
    } catch {}
  };

  const loadClasses = async () => {
    try {
      const { data, error } = await supabase.from('classes').select('id, name, level, institution_id, academic_year_id').order('level', { ascending: true }).order('name', { ascending: true });
      if (!error) setClasses(data as any || []);
    } catch {}
  };

  const loadAcademicYears = async () => {
    try {
      const { data, error } = await supabase.from('academic_years').select('id, code, description').order('start_date', { ascending: false });
      if (!error) setAcademicYears(data as any || []);
    } catch {}
  };

  const filteredFromClasses = useMemo(() => {
    return classes.filter(c => (
      (!selectedInstitutionId || c.institution_id === selectedInstitutionId) &&
      (!sourceAcademicYearId || c.academic_year_id === sourceAcademicYearId)
    ));
  }, [classes, selectedInstitutionId, sourceAcademicYearId]);

  const filteredToClasses = useMemo(() => {
    return classes.filter(c => (
      (!selectedInstitutionId || c.institution_id === selectedInstitutionId) &&
      (!targetAcademicYearId || c.academic_year_id === targetAcademicYearId)
    ));
  }, [classes, selectedInstitutionId, targetAcademicYearId]);

  const filteredKenaikan = kenaikan.filter(item => 
    item.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kelasSaatIni.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kelasTujuan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedKenaikan(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedKenaikan(item);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setKenaikanToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (kenaikanToDelete) {
      setKenaikan(prev => prev.filter(item => item.id !== kenaikanToDelete));
      toast({
        title: "Berhasil",
        description: "Data kenaikan kelas berhasil dihapus"
      });
    }
    setDeleteDialogOpen(false);
    setKenaikanToDelete(null);
  };

  const handleSubmit = (data: any) => {
    if (formMode === "create") {
      const newKenaikan = {
        ...data,
        id: Math.max(...kenaikan.map(k => k.id)) + 1
      };
      setKenaikan(prev => [...prev, newKenaikan]);
      toast({
        title: "Berhasil",
        description: "Data kenaikan kelas berhasil ditambahkan"
      });
    } else {
      setKenaikan(prev => prev.map(item => 
        item.id === selectedKenaikan?.id ? { ...data, id: selectedKenaikan.id } : item
      ));
      toast({
        title: "Berhasil",
        description: "Data kenaikan kelas berhasil diperbarui"
      });
    }
    setFormOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Naik":
        return "bg-success/10 text-success";
      case "Pending":
        return "bg-warning/10 text-warning";
      case "Tinggal Kelas":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  const handleGenerateNextYearClasses = async () => {
    try {
      if (!selectedInstitutionId) {
        toast({ title: "Validasi", description: "Pilih lembaga terlebih dahulu", variant: "destructive" });
        return;
      }
      if (!sourceAcademicYearId || !targetAcademicYearId) {
        toast({ title: "Validasi", description: "Pilih Tahun Ajaran sumber dan tujuan", variant: "destructive" });
        return;
      }
      if (sourceAcademicYearId === targetAcademicYearId) {
        toast({ title: "Validasi", description: "Tahun Ajaran sumber dan tujuan tidak boleh sama", variant: "destructive" });
        return;
      }
      setGenerating(true);

      // 1) Ambil kelas di TA sumber untuk lembaga terpilih
      let list: any[] = [];
      {
        const { data: sourceClasses, error: srcErr } = await supabase
          .from('classes')
          .select('id, name, level, institution_id, academic_year_id')
          .eq('institution_id', selectedInstitutionId)
          .eq('academic_year_id', sourceAcademicYearId)
          .order('level', { ascending: true })
          .order('name', { ascending: true });
        if (srcErr) throw srcErr;
        list = sourceClasses || [];
      }
      // Fallback: jika belum ada data terikat TA (legacy data), ambil semua kelas lembaga tsb tanpa filter TA
      if (list.length === 0) {
        const { data: fallbackClasses, error: fbErr } = await supabase
          .from('classes')
          .select('id, name, level, institution_id, academic_year_id')
          .eq('institution_id', selectedInstitutionId)
          .order('level', { ascending: true })
          .order('name', { ascending: true });
        if (fbErr) throw fbErr;
        list = fallbackClasses || [];
        if (list.length === 0) {
          toast({ title: "Info", description: "Tidak ada kelas pada lembaga ini untuk digenerate" });
          return;
        }
      }

      // 2) Tentukan level akhir kurikulum (bukan sekadar level maksimum pada data sumber)
      const maxLevel = list.reduce((m: number, c: any) => Math.max(m, c.level || 0), 0);
      // Infer final level by band: SD=6, SMP/MTs=9, SMA/SMK/MA=12
      const inferredFinalLevel = maxLevel >= 10 ? 12 : maxLevel >= 7 ? 9 : maxLevel >= 1 ? 6 : maxLevel;
      // Promote semua kelas yang level-nya masih di bawah level akhir kurikulum
      const promotable = list.filter((c: any) => (c.level || 0) < inferredFinalLevel);
      if (promotable.length === 0) {
        toast({ title: "Info", description: "Semua kelas adalah level akhir. Tidak ada yang digandakan." });
        return;
      }

      // 3) Ambil kelas yang sudah ada di TA target untuk hindari duplikasi
      const { data: targetExisting, error: tgtErr } = await supabase
        .from('classes')
        .select('id, name, level')
        .eq('institution_id', selectedInstitutionId)
        .eq('academic_year_id', targetAcademicYearId);
      if (tgtErr) throw tgtErr;
      const exists = new Map<string, boolean>();
      (targetExisting || []).forEach((c: any) => {
        exists.set(`${c.name}|${c.level}`, true);
      });

      // 4) Susun insert untuk kelas baru: level+1, nama disalin apa adanya
      // Nama kelas disalin apa adanya; jika ingin menambahkan label paralel, dapat diatur di sini
      const toInsert = promotable
        .map((c: any) => ({ name: c.name, level: (c.level || 0) + 1 }))
        .filter((c: any) => !exists.get(`${c.name}|${c.level}`))
        .map((c: any) => ({
          name: c.name,
          level: c.level,
          institution_id: selectedInstitutionId,
          academic_year_id: targetAcademicYearId,
        }));

      if (toInsert.length === 0) {
        toast({ title: "Info", description: "Tidak ada kelas baru untuk dibuat (mungkin sudah ada semua)" });
        return;
      }

      const { error: insErr } = await supabase.from('classes').insert(toInsert);
      if (insErr) throw insErr;

      // Refresh kelas
      await loadClasses();

      toast({ title: "Berhasil", description: `Berhasil membuat ${toInsert.length} kelas di TA tujuan` });
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Gagal membuat kelas TA baru", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const handleProcessPromotion = async () => {
    try {
      if (!selectedInstitutionId) {
        toast({ title: "Validasi", description: "Pilih lembaga terlebih dahulu", variant: "destructive" });
        return;
      }
      if (graduationMode) {
        // Luluskan semua siswa di fromClassId (diasumsikan kelas akhir)
        if (!fromClassId) {
          toast({ title: "Validasi", description: "Pilih kelas yang akan diluluskan", variant: "destructive" });
          return;
        }
        const { data: gradRows, error } = await supabase.from('students')
          .update({ status: 'graduated', class_id: null })
          .eq('class_id', fromClassId)
          .select('id');
        if (error) throw error;
        const count = (gradRows || []).length;
        toast({ title: "Berhasil", description: `Diluluskan ${count} siswa dari kelas asal` });
        try { window.dispatchEvent(new Event('app:refresh-students')); } catch {}
        return;
      }

      if (!fromClassId || !toClassId) {
        toast({ title: "Validasi", description: "Pilih kelas asal dan kelas tujuan", variant: "destructive" });
        return;
      }
      if (fromClassId === toClassId) {
        toast({ title: "Validasi", description: "Kelas asal dan tujuan tidak boleh sama", variant: "destructive" });
        return;
      }

      // Bulk update students from fromClassId -> toClassId
      const { data: moved, error } = await supabase.from('students')
        .update({ class_id: toClassId })
        .eq('class_id', fromClassId)
        .select('id');
      if (error) throw error;

      const count = (moved || []).length;
      toast({ title: "Kenaikan Kelas Berhasil", description: `Berhasil memindahkan ${count} siswa ke kelas tujuan` });
      try { 
        window.dispatchEvent(new Event('app:refresh-students'));
        window.dispatchEvent(new Event('app:refresh-classes'));
      } catch {}
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Gagal memproses kenaikan/lulus", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kenaikan Kelas</h2>
          <p className="text-muted-foreground">
            Kelola proses kenaikan kelas siswa
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Data
          </Button>
          <Button onClick={() => setShowKenaikanDialog(true)}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Proses Kenaikan
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Data Kenaikan Kelas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filter Proses Kenaikan */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Lembaga</Label>
              <Select value={selectedInstitutionId} onValueChange={(v) => { setSelectedInstitutionId(v); setFromClassId(""); setToClassId(""); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih lembaga" />
                </SelectTrigger>
                <SelectContent>
                  {institutions.map((i) => (
                    <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Kelas Asal</Label>
              <Select value={fromClassId} onValueChange={setFromClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kelas asal" />
                </SelectTrigger>
                <SelectContent>
                  {filteredFromClasses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.level}. {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Kelas Tujuan</Label>
              <Select value={toClassId} onValueChange={setToClassId} disabled={graduationMode}>
                <SelectTrigger>
                  <SelectValue placeholder={graduationMode ? "Nonaktif saat luluskan" : "Pilih kelas tujuan"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredToClasses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.level}. {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tahun Ajaran</Label>
              <Select value={selectedAcademicYearId} onValueChange={setSelectedAcademicYearId}>
                <SelectTrigger>
                  <SelectValue placeholder="Opsional: pilih tahun ajaran" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((y) => (
                    <SelectItem key={y.id} value={y.id}>{y.code} - {y.description}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generator Kelas TA Baru */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label>TA Sumber</Label>
              <Select value={sourceAcademicYearId} onValueChange={setSourceAcademicYearId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih TA sumber" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((y) => (
                    <SelectItem key={y.id} value={y.id}>{y.code} - {y.description}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>TA Tujuan</Label>
              <Select value={targetAcademicYearId} onValueChange={setTargetAcademicYearId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih TA tujuan" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((y) => (
                    <SelectItem key={y.id} value={y.id}>{y.code} - {y.description}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 flex items-end justify-end">
              <Button onClick={handleGenerateNextYearClasses} disabled={generating || !selectedInstitutionId}>
                {generating ? 'Memproses…' : 'Generate Kelas TA Baru'}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm">
              <input id="graduationMode" type="checkbox" checked={graduationMode} onChange={(e) => setGraduationMode(e.target.checked)} />
              <Label htmlFor="graduationMode">Luluskan (kelas akhir)</Label>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setSelectedInstitutionId(""); setFromClassId(""); setToClassId(""); setSelectedAcademicYearId(""); setGraduationMode(false); }}>Reset</Button>
              <Button onClick={() => setShowKenaikanDialog(true)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Proses
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NIS</TableHead>
                <TableHead>Nama Siswa</TableHead>
                <TableHead>Kelas Saat Ini</TableHead>
                <TableHead>Kelas Tujuan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKenaikan.map((siswa) => (
                <TableRow key={siswa.id}>
                  <TableCell className="font-medium">{siswa.nis}</TableCell>
                  <TableCell>{siswa.nama}</TableCell>
                  <TableCell>{siswa.kelasSaatIni}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ArrowUp className="h-4 w-4 text-primary" />
                      {siswa.kelasTujuan}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(siswa.status)}`}>
                      {siswa.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(siswa)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(siswa.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Proses Kenaikan */}
      <Dialog open={showKenaikanDialog} onOpenChange={setShowKenaikanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Proses Kenaikan Kelas</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{graduationMode ? 'Apakah Anda yakin ingin meluluskan seluruh siswa di kelas asal?' : 'Apakah Anda yakin ingin memindahkan seluruh siswa dari kelas asal ke kelas tujuan?'}</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowKenaikanDialog(false)}>
                Batal
              </Button>
              <Button onClick={async () => { await handleProcessPromotion(); setShowKenaikanDialog(false); }}>
                Proses
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      <KenaikanKelasForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedKenaikan}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus"
        description="Apakah Anda yakin ingin menghapus data kenaikan kelas ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
}