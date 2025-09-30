import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Plus, Search, Edit, Trash2, Users, Download, Upload } from "lucide-react";
import { KelasForm } from "@/components/forms/KelasForm";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as XLSX from 'xlsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface KelasData {
  id: string;
  name: string;
  level: number;
  academic_year_id: string | null;
  institution_id?: string | null;
  homeroom_teacher: string | null;
  capacity: number | null;
  current_students: number | null;
  created_at: string | null;
  updated_at: string | null;
  institutions?: {
    id: string;
    name: string;
    address: string | null;
    principal: string | null;
    status: string | null;
  };
  academic_years?: {
    id: string;
    code: string;
    description: string;
  } | null;
}

interface InstitutionData {
  id: string;
  name: string;
  address: string | null;
  principal: string | null;
  status: string | null;
}

export default function Kelas() {
  const [searchQuery, setSearchQuery] = useState("");
  const [kelas, setKelas] = useState<KelasData[]>([]);
  const [institutions, setInstitutions] = useState<InstitutionData[]>([]);
  const [academicYears, setAcademicYears] = useState<Array<{ id: string; code: string; description: string; is_active: boolean }>>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedKelas, setSelectedKelas] = useState<KelasData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [kelasToDelete, setKelasToDelete] = useState<string | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Student import states
  const [studentImportDialogOpen, setStudentImportDialogOpen] = useState(false);
  const [importingStudents, setImportingStudents] = useState(false);
  const studentFileInputRef = useRef<HTMLInputElement>(null);
  const [selectedClassForStudents, setSelectedClassForStudents] = useState<KelasData | null>(null);
  const { toast } = useToast();

  // Load data from database
  useEffect(() => {
    loadKelas();
    loadInstitutions();
    loadAcademicYears();
    const onRefresh = () => loadKelas();
    window.addEventListener('app:refresh-classes', onRefresh);
    return () => window.removeEventListener('app:refresh-classes', onRefresh);
  }, []);

  const loadKelas = async () => {
    try {
      setLoading(true);
      // Load classes with institution_id
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select(`
          id,
          name,
          level,
          academic_year_id,
          institution_id,
          homeroom_teacher,
          capacity,
          current_students,
          created_at,
          updated_at,
          academic_years ( id, code, description )
        `)
        .order('created_at', { ascending: false });

      if (classesError) {
        console.error('Error loading classes:', classesError);
        toast({
          title: "Error",
          description: "Gagal memuat data kelas",
          variant: "destructive"
        });
        return;
      }

      // Load institutions data
      const { data: institutionsData, error: institutionsError } = await supabase
        .from('institutions')
        .select('id, name, address, principal, status')
        .in('status', ['Aktif', 'active']);

      if (institutionsError) {
        console.error('Error loading institutions:', institutionsError);
      }

      // Map institutions to classes
      const classesWithInstitutions = (classesData || []).map(classItem => {
        const institution = institutionsData?.find(inst => inst.id === classItem.institution_id);
        return {
          ...classItem,
          institutions: institution || null
        };
      });

      setKelas(classesWithInstitutions);
    } catch (error) {
      console.error('Error loading classes:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data kelas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadInstitutions = async () => {
    try {
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .in('status', ['Aktif', 'active']) // Support both formats
        .order('name', { ascending: true });

      if (error) {
        console.error('Error loading institutions:', error);
        toast({
          title: "Error",
          description: "Gagal memuat data lembaga",
          variant: "destructive"
        });
        return;
      }

      setInstitutions(data || []);
    } catch (error) {
      console.error('Error loading institutions:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data lembaga",
        variant: "destructive"
      });
    }
  };

  const loadAcademicYears = async () => {
    try {
      const { data, error } = await supabase
        .from('academic_years')
        .select('id, code, description, is_active')
        .order('start_date', { ascending: false });
      if (!error) setAcademicYears(data as any || []);
    } catch {}
  };

  const setActiveYearForClassesWithoutTA = async () => {
    try {
      const active = academicYears.find(y => y.is_active);
      if (!active) {
        toast({ title: "Info", description: "Tidak ada Tahun Ajaran aktif", variant: "destructive" });
        return;
      }
      const { error } = await supabase
        .from('classes')
        .update({ academic_year_id: active.id })
        .is('academic_year_id', null);
      if (error) throw error;
      await loadKelas();
      toast({ title: "Berhasil", description: `Kelas tanpa TA telah ditetapkan ke ${active.code}` });
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Gagal menetapkan TA aktif untuk kelas tanpa TA", variant: "destructive" });
    }
  };

  const filteredKelas = kelas.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.homeroom_teacher && item.homeroom_teacher.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAdd = () => {
    setSelectedKelas(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEdit = (item: KelasData) => {
    setSelectedKelas(item);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setKelasToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (kelasToDelete) {
      try {
        const { error } = await supabase
          .from('classes')
          .delete()
          .eq('id', kelasToDelete);

        if (error) {
          console.error('Error deleting class:', error);
          toast({
            title: "Error",
            description: "Gagal menghapus kelas",
            variant: "destructive"
          });
          return;
        }

      setKelas(prev => prev.filter(item => item.id !== kelasToDelete));
      toast({
        title: "Berhasil",
        description: "Kelas berhasil dihapus"
      });
      } catch (error) {
        console.error('Error deleting class:', error);
        toast({
          title: "Error",
          description: "Gagal menghapus kelas",
          variant: "destructive"
        });
      }
    }
    setDeleteDialogOpen(false);
    setKelasToDelete(null);
  };

  // Download student template Excel
  const downloadStudentTemplate = (kelas: KelasData) => {
    const templateData = [
      {
        'NIS': '2024001',
        'Nama': 'Ahmad Wijaya',
        'Jenis Kelamin': 'Laki-laki',
        'Tanggal Lahir': '2008-05-15',
        'Tempat Lahir': 'Jakarta',
        'Alamat': 'Jl. Merdeka No. 123, Jakarta',
        'No. Telepon': '081234567890',
        'Nama Orang Tua': 'Budi Wijaya',
        'No. Telepon Orang Tua': '081234567891',
        'Status': 'Aktif'
      },
      {
        'NIS': '2024002',
        'Nama': 'Siti Aminah',
        'Jenis Kelamin': 'Perempuan',
        'Tanggal Lahir': '2008-03-20',
        'Tempat Lahir': 'Bandung',
        'Alamat': 'Jl. Sudirman No. 456, Bandung',
        'No. Telepon': '081234567892',
        'Nama Orang Tua': 'Sari Aminah',
        'No. Telepon Orang Tua': '081234567893',
        'Status': 'Aktif'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Template Siswa - ${kelas.name}`);
    
    // Set column widths
    const columnWidths = [
      { wch: 12 }, // NIS
      { wch: 20 }, // Nama
      { wch: 15 }, // Jenis Kelamin
      { wch: 15 }, // Tanggal Lahir
      { wch: 15 }, // Tempat Lahir
      { wch: 30 }, // Alamat
      { wch: 15 }, // No. Telepon
      { wch: 20 }, // Nama Orang Tua
      { wch: 20 }, // No. Telepon Orang Tua
      { wch: 10 }  // Status
    ];
    worksheet['!cols'] = columnWidths;

    XLSX.writeFile(workbook, `Template_Siswa_${kelas.name.replace(/\s+/g, '_')}.xlsx`);
    
    toast({
      title: "Template Downloaded",
      description: `Template Excel untuk ${kelas.name} berhasil diunduh`
    });
  };

  // Download template Excel
  const downloadTemplate = () => {
    // Template data dengan ID lembaga
    const templateData = [
      {
        'Nama Kelas': 'X IPA 1',
        'Level': 10,
        'ID_Lembaga': institutions.length > 0 ? institutions[0].id : '',
        'Wali Kelas': 'Budi Santoso',
        'Kapasitas': 30
      },
      {
        'Nama Kelas': 'X IPA 2',
        'Level': 10,
        'ID_Lembaga': institutions.length > 0 ? institutions[0].id : '',
        'Wali Kelas': 'Siti Aminah',
        'Kapasitas': 30
      },
      {
        'Nama Kelas': 'XI IPA 1',
        'Level': 11,
        'ID_Lembaga': institutions.length > 0 ? institutions[0].id : '',
        'Wali Kelas': 'Ahmad Wijaya',
        'Kapasitas': 30
      }
    ];

    // Data referensi lembaga
    const institutionReference = institutions.map(inst => ({
      'ID_Lembaga': inst.id,
      'Nama_Lembaga': inst.name,
      'Alamat': inst.address || '',
      'Kepala_Lembaga': inst.principal || '',
      'Status': inst.status || ''
    }));

    // Buat worksheet untuk template
    const templateWorksheet = XLSX.utils.json_to_sheet(templateData);
    const referenceWorksheet = XLSX.utils.json_to_sheet(institutionReference);
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, templateWorksheet, 'Template Kelas');
    XLSX.utils.book_append_sheet(workbook, referenceWorksheet, 'Referensi Lembaga');
    
    // Set column widths untuk template
    const templateColumnWidths = [
      { wch: 15 }, // Nama Kelas
      { wch: 8 },  // Level
      { wch: 40 }, // ID_Lembaga
      { wch: 20 }, // Wali Kelas
      { wch: 10 }  // Kapasitas
    ];
    templateWorksheet['!cols'] = templateColumnWidths;

    // Set column widths untuk referensi
    const referenceColumnWidths = [
      { wch: 40 }, // ID_Lembaga
      { wch: 25 }, // Nama_Lembaga
      { wch: 30 }, // Alamat
      { wch: 25 }, // Kepala_Lembaga
      { wch: 10 }  // Status
    ];
    referenceWorksheet['!cols'] = referenceColumnWidths;

    XLSX.writeFile(workbook, 'Template_Kelas.xlsx');
    
    toast({
      title: "Template Downloaded",
      description: "Template Excel dengan referensi lembaga berhasil diunduh"
    });
  };

  // Handle student file upload
  const handleStudentFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          toast({
            title: "File Kosong",
            description: "File Excel tidak mengandung data siswa",
            variant: "destructive"
          });
          return;
        }

        processStudentImportData(jsonData);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        toast({
          title: "Error",
          description: "Gagal membaca file Excel",
          variant: "destructive"
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Process imported student data
  const processStudentImportData = async (data: any[]) => {
    if (!selectedClassForStudents) return;
    
    setImportingStudents(true);
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const row of data) {
      try {
        // Validate required fields
        if (!row['NIS'] || !row['Nama']) {
          errors.push(`Baris ${data.indexOf(row) + 2}: NIS dan Nama harus diisi`);
          errorCount++;
          continue;
        }

        // Validate gender
        const gender = row['Jenis Kelamin']?.toString().toLowerCase();
        if (gender && !['laki-laki', 'perempuan'].includes(gender)) {
          errors.push(`Baris ${data.indexOf(row) + 2}: Jenis Kelamin harus 'Laki-laki' atau 'Perempuan'`);
          errorCount++;
          continue;
        }

        // Validate status
        const status = row['Status']?.toString().toLowerCase();
        if (status && !['aktif', 'tidak aktif'].includes(status)) {
          errors.push(`Baris ${data.indexOf(row) + 2}: Status harus 'Aktif' atau 'Tidak Aktif'`);
          errorCount++;
          continue;
        }

        const { error } = await supabase
          .from('students')
          .insert({
            nis: row['NIS'].toString().trim(),
            name: row['Nama'].toString().trim(),
            gender: gender === 'laki-laki' ? 'male' : 'female',
            birth_date: row['Tanggal Lahir'] ? new Date(row['Tanggal Lahir']).toISOString().split('T')[0] : null,
            birth_place: row['Tempat Lahir']?.toString().trim() || null,
            address: row['Alamat']?.toString().trim() || null,
            phone: row['No. Telepon']?.toString().trim() || null,
            parent_name: row['Nama Orang Tua']?.toString().trim() || null,
            parent_phone: row['No. Telepon Orang Tua']?.toString().trim() || null,
            status: status === 'aktif' ? 'active' : 'inactive',
            class_id: selectedClassForStudents.id,
            admission_date: new Date().toISOString().split('T')[0]
          });

        if (error) {
          errors.push(`Baris ${data.indexOf(row) + 2}: ${error.message}`);
          errorCount++;
        } else {
          successCount++;
        }
      } catch (error) {
        errors.push(`Baris ${data.indexOf(row) + 2}: Error tidak diketahui`);
        errorCount++;
      }
    }

    setImportingStudents(false);
    setStudentImportDialogOpen(false);
    
    // Reset file input
    if (studentFileInputRef.current) {
      studentFileInputRef.current.value = '';
    }

    // Show results
    if (successCount > 0) {
      toast({
        title: "Import Berhasil",
        description: `${successCount} siswa berhasil diimpor ke ${selectedClassForStudents.name}`
      });
    }

    if (errorCount > 0) {
      toast({
        title: "Import dengan Error",
        description: `${errorCount} siswa gagal diimpor. ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? '...' : ''}`,
        variant: "destructive"
      });
    }

    setSelectedClassForStudents(null);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Format File Salah",
        description: "Harap pilih file Excel (.xlsx atau .xls)",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          toast({
            title: "File Kosong",
            description: "File Excel tidak mengandung data",
            variant: "destructive"
          });
          return;
        }

        processImportData(jsonData);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        toast({
          title: "Error",
          description: "Gagal membaca file Excel",
          variant: "destructive"
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Process imported data
  const processImportData = async (data: any[]) => {
    setImporting(true);
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const row of data) {
      try {
        // Validate required fields
        if (!row['Nama Kelas'] || !row['Level']) {
          errors.push(`Baris ${data.indexOf(row) + 2}: Nama Kelas dan Level harus diisi`);
          errorCount++;
          continue;
        }

        // Validate level is a number
        const level = parseInt(row['Level']);
        if (isNaN(level) || level < 1 || level > 12) {
          errors.push(`Baris ${data.indexOf(row) + 2}: Level harus berupa angka 1-12`);
          errorCount++;
          continue;
        }

        // Validate capacity is a number if provided
        let capacity = null;
        if (row['Kapasitas']) {
          capacity = parseInt(row['Kapasitas']);
          if (isNaN(capacity) || capacity < 1) {
            errors.push(`Baris ${data.indexOf(row) + 2}: Kapasitas harus berupa angka positif`);
            errorCount++;
            continue;
          }
        }

        // Find institution by ID
        let institutionId = null;
        if (row['ID_Lembaga']) {
          const institution = institutions.find(inst => 
            inst.id === row['ID_Lembaga'].toString().trim()
          );
          if (institution) {
            institutionId = institution.id;
          } else {
            errors.push(`Baris ${data.indexOf(row) + 2}: ID Lembaga "${row['ID_Lembaga']}" tidak ditemukan. Gunakan ID dari sheet "Referensi Lembaga"`);
            errorCount++;
            continue;
          }
        }

        const { data: newClass, error } = await supabase
          .from('classes')
          .insert({
            name: row['Nama Kelas'].toString().trim(),
            level: level,
            homeroom_teacher: row['Wali Kelas']?.toString().trim() || null,
            capacity: capacity
          })
          .select()
          .single();

        if (error) {
          errors.push(`Baris ${data.indexOf(row) + 2}: ${error.message}`);
          errorCount++;
        } else {
          // Add institution data to the new class
          const classWithInstitution = {
            ...newClass,
            institution_id: institutionId,
            institutions: institutionId ? institutions.find(inst => inst.id === institutionId) : null
          };
          
          // Update state with new class
          setKelas(prev => [classWithInstitution, ...prev]);
          successCount++;
        }
      } catch (error) {
        errors.push(`Baris ${data.indexOf(row) + 2}: Error tidak diketahui`);
        errorCount++;
      }
    }

    setImporting(false);
    setImportDialogOpen(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Reload data
    await loadKelas();

    // Show results
    if (successCount > 0) {
      toast({
        title: "Import Berhasil",
        description: `${successCount} kelas berhasil diimpor`
      });
    }

    if (errorCount > 0) {
      toast({
        title: "Import dengan Error",
        description: `${errorCount} baris gagal diimpor. ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? '...' : ''}`,
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (data: any) => {
    try {
    if (formMode === "create") {
        const { data: newClass, error } = await supabase
          .from('classes')
          .insert({
            name: data.nama,
            level: data.level,
            homeroom_teacher: data.waliKelas,
            capacity: data.kapasitas,
            ...(data.institution_id && { institution_id: data.institution_id })
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating class:', error);
          toast({
            title: "Error",
            description: "Gagal menambahkan kelas",
            variant: "destructive"
          });
          return;
        }

        setKelas(prev => [newClass, ...prev]);
      toast({
        title: "Berhasil",
        description: "Kelas berhasil ditambahkan"
      });
    } else {
        const { data: updatedClass, error } = await supabase
          .from('classes')
          .update({
            name: data.nama,
            level: data.level,
            homeroom_teacher: data.waliKelas,
            capacity: data.kapasitas,
            ...(data.institution_id && { institution_id: data.institution_id })
          })
          .eq('id', selectedKelas?.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating class:', error);
          toast({
            title: "Error",
            description: "Gagal memperbarui kelas",
            variant: "destructive"
          });
          return;
        }

      setKelas(prev => prev.map(item => 
          item.id === selectedKelas?.id ? updatedClass : item
      ));
      toast({
        title: "Berhasil",
        description: "Kelas berhasil diperbarui"
      });
    }
    } catch (error) {
      console.error('Error saving class:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan kelas",
        variant: "destructive"
      });
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Data Kelas</h2>
          <p className="text-muted-foreground">
            Kelola data kelas dan pembagian siswa
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
          <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import Excel
          </Button>
          <Button variant="outline" onClick={setActiveYearForClassesWithoutTA}>
            Tetapkan TA Aktif ke Kelas Tanpa TA
          </Button>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kelas
        </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Daftar Kelas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari kelas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kelas</TableHead>
                <TableHead>Level</TableHead>
              <TableHead>Tahun Ajaran</TableHead>
                <TableHead>Lembaga</TableHead>
                <TableHead>Wali Kelas</TableHead>
                <TableHead>Jumlah Siswa</TableHead>
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
              ) : filteredKelas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Tidak ada data kelas
                  </TableCell>
                </TableRow>
              ) : (
                filteredKelas.map((item) => (
                <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>Level {item.level}</TableCell>
                  <TableCell>{item.academic_years ? item.academic_years.code : '-'}</TableCell>
                    <TableCell>
                      {item.institutions?.name || "-"}
                    </TableCell>
                    <TableCell>{item.homeroom_teacher || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                        {item.current_students || 0} / {item.capacity || 0}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setSelectedClassForStudents(item);
                          setStudentImportDialogOpen(true);
                        }}
                        title="Tambah Siswa"
                      >
                        <Users className="h-4 w-4" />
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

      <KelasForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        initialData={selectedKelas ? {
          id: selectedKelas.id,
          nama: selectedKelas.name,
          level: selectedKelas.level,
          waliKelas: selectedKelas.homeroom_teacher || "",
          kapasitas: selectedKelas.capacity || 0,
          institution_id: selectedKelas.institution_id || ""
        } : undefined}
        mode={formMode}
        institutions={institutions}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Hapus Kelas"
        description="Apakah Anda yakin ingin menghapus kelas ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={confirmDelete}
      />

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Data Kelas
            </DialogTitle>
            <DialogDescription>
              Upload file Excel (.xlsx) yang berisi data kelas. Pastikan format sesuai dengan template.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    {importing ? "Mengimpor data..." : "Pilih file Excel"}
                  </span>
                  <span className="mt-1 block text-sm text-gray-500">
                    atau drag & drop file di sini
                  </span>
                </label>
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={importing}
                  className="sr-only"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Format Template:</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• <strong>Nama Kelas:</strong> Nama kelas (contoh: X IPA 1)</p>
                <p>• <strong>Level:</strong> Tingkat kelas (1-12)</p>
                <p>• <strong>ID_Lembaga:</strong> ID lembaga (lihat sheet "Referensi Lembaga")</p>
                <p>• <strong>Wali Kelas:</strong> Nama wali kelas (opsional)</p>
                <p>• <strong>Kapasitas:</strong> Jumlah maksimal siswa (opsional)</p>
                <p className="text-orange-600 font-medium">📋 Gunakan ID dari sheet "Referensi Lembaga" untuk kolom ID_Lembaga</p>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setImportDialogOpen(false)}
                disabled={importing}
              >
                Batal
              </Button>
              <Button 
                onClick={downloadTemplate}
                disabled={importing}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Student Import Dialog */}
      <Dialog open={studentImportDialogOpen} onOpenChange={setStudentImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Siswa ke {selectedClassForStudents?.name}</DialogTitle>
            <DialogDescription>
              Import data siswa dari file Excel untuk kelas {selectedClassForStudents?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="student-file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    {importingStudents ? "Mengimpor data siswa..." : "Pilih file Excel siswa"}
                  </span>
                  <span className="mt-1 block text-sm text-gray-500">
                    atau drag & drop file di sini
                  </span>
                </label>
                <input
                  ref={studentFileInputRef}
                  id="student-file-upload"
                  name="student-file-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleStudentFileUpload}
                  disabled={importingStudents}
                  className="sr-only"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Format Template Siswa:</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• <strong>NIS:</strong> Nomor Induk Siswa (wajib)</p>
                <p>• <strong>Nama:</strong> Nama lengkap siswa (wajib)</p>
                <p>• <strong>Jenis Kelamin:</strong> Laki-laki atau Perempuan</p>
                <p>• <strong>Tanggal Lahir:</strong> Format YYYY-MM-DD</p>
                <p>• <strong>Tempat Lahir:</strong> Kota tempat lahir</p>
                <p>• <strong>Alamat:</strong> Alamat lengkap siswa</p>
                <p>• <strong>No. Telepon:</strong> Nomor telepon siswa</p>
                <p>• <strong>Nama Orang Tua:</strong> Nama orang tua/wali</p>
                <p>• <strong>No. Telepon Orang Tua:</strong> Nomor telepon orang tua</p>
                <p>• <strong>Status:</strong> Aktif atau Tidak Aktif</p>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setStudentImportDialogOpen(false);
                  setSelectedClassForStudents(null);
                }}
                disabled={importingStudents}
              >
                Batal
              </Button>
              <Button 
                onClick={() => downloadStudentTemplate(selectedClassForStudents!)}
                disabled={importingStudents}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}