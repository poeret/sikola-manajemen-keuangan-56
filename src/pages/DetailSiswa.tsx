import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StudentDetailData {
  id: string;
  nis: string;
  name: string;
  class_id: string | null;
  classes?: { name: string; level: number; institution_id: string | null } | null;
}

interface StudentBillRow {
  id: string;
  amount: number;
  due_date: string | null;
  status: string | null;
  bills?: { name?: string | null; code?: string | null } | null;
}

const statusToBadge = (status: string | null) => {
  switch (status) {
    case 'paid':
      return <Badge variant="default">Lunas</Badge>;
    case 'overdue':
      return <Badge variant="destructive">Jatuh Tempo</Badge>;
    case 'cancelled':
      return <Badge variant="secondary">Dibatalkan</Badge>;
    default:
      return <Badge variant="secondary">Belum Bayar</Badge>;
  }
};

export default function DetailSiswa() {
  const { id } = useParams();
  const [student, setStudent] = useState<StudentDetailData | null>(null);
  const [bills, setBills] = useState<StudentBillRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      loadStudent(id);
      loadBills(id);
    }
  }, [id]);

  const loadStudent = async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, nis, name, class_id, classes(name, level, institution_id)')
        .eq('id', studentId)
        .single();
      if (error) throw error;
      setStudent(data as any);
    } catch (err) {
      console.error('Error loading student detail:', err);
      toast({ title: 'Error', description: 'Gagal memuat detail siswa', variant: 'destructive' });
    }
  };

  const loadBills = async (studentId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('student_bills')
        .select('id, amount, due_date, status, bills(name, code)')
        .eq('student_id', studentId)
        .order('due_date', { ascending: true });
      if (error) throw error;
      setBills((data || []) as any);
    } catch (err) {
      console.error('Error loading student bills:', err);
      toast({ title: 'Error', description: 'Gagal memuat daftar tagihan', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Detail Siswa</h2>
          <p className="text-muted-foreground">Informasi siswa dan daftar tagihan per bulan</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/siswa">Kembali</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          {student ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">NIS</div>
                <div className="font-medium">{student.nis}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Nama</div>
                <div className="font-medium">{student.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Kelas</div>
                <div className="font-medium">{student.classes?.name || '-'}</div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Memuat...</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Tagihan Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama Tagihan</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">Memuat data...</TableCell>
                </TableRow>
              ) : bills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">Belum ada tagihan</TableCell>
                </TableRow>
              ) : (
                bills.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-sm">{row.bills?.code || '-'}</TableCell>
                    <TableCell>{row.bills?.name || '-'}</TableCell>
                    <TableCell>{row.due_date ? new Date(row.due_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) : '-'}</TableCell>
                    <TableCell>Rp {row.amount.toLocaleString('id-ID')}</TableCell>
                    <TableCell>{statusToBadge(row.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


