import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save, School, User, Shield, Bell, Database } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export default function Pengaturan() {
  const [namaSekolah, setNamaSekolah] = useState("SMK Negeri 1 Jakarta");
  const [alamatSekolah, setAlamatSekolah] = useState("Jl. Pendidikan No. 123, Jakarta");
  const [emailSekolah, setEmailSekolah] = useState("admin@smkn1jakarta.sch.id");
  const [notifikasiEmail, setNotifikasiEmail] = useState(true);
  const [backupOtomatis, setBackupOtomatis] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pengaturan Sistem</h2>
        <p className="text-muted-foreground">
          Kelola pengaturan aplikasi dan konfigurasi sistem
        </p>
      </div>

      <Tabs defaultValue="sekolah" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sekolah">Info Sekolah</TabsTrigger>
          <TabsTrigger value="pengguna">Pengguna</TabsTrigger>
          <TabsTrigger value="sistem">Sistem</TabsTrigger>
          <TabsTrigger value="notifikasi">Notifikasi</TabsTrigger>
        </TabsList>

        <TabsContent value="sekolah">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                Informasi Sekolah
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nama-sekolah">Nama Sekolah</Label>
                  <Input
                    id="nama-sekolah"
                    value={namaSekolah}
                    onChange={(e) => setNamaSekolah(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-sekolah">Email Sekolah</Label>
                  <Input
                    id="email-sekolah"
                    type="email"
                    value={emailSekolah}
                    onChange={(e) => setEmailSekolah(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alamat-sekolah">Alamat Sekolah</Label>
                <Input
                  id="alamat-sekolah"
                  value={alamatSekolah}
                  onChange={(e) => setAlamatSekolah(e.target.value)}
                />
              </div>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Simpan Perubahan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pengguna">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Pengaturan Pengguna
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Aktifkan Registrasi Mandiri</Label>
                    <p className="text-sm text-muted-foreground">Izinkan pengguna baru mendaftar sendiri</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Verifikasi Email Wajib</Label>
                    <p className="text-sm text-muted-foreground">Wajibkan verifikasi email saat registrasi</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Reset Password Otomatis</Label>
                    <p className="text-sm text-muted-foreground">Izinkan reset password via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Simpan Pengaturan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sistem">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Pengaturan Sistem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Backup Otomatis</Label>
                    <p className="text-sm text-muted-foreground">Lakukan backup data secara otomatis</p>
                  </div>
                  <Switch checked={backupOtomatis} onCheckedChange={setBackupOtomatis} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mode Pemeliharaan</Label>
                    <p className="text-sm text-muted-foreground">Aktifkan mode pemeliharaan sistem</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Log Aktivitas</Label>
                    <p className="text-sm text-muted-foreground">Catat semua aktivitas pengguna</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Database className="mr-2 h-4 w-4" />
                    Backup Sekarang
                  </Button>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Bersihkan Cache
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifikasi">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Pengaturan Notifikasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifikasi Email</Label>
                    <p className="text-sm text-muted-foreground">Kirim notifikasi via email</p>
                  </div>
                  <Switch checked={notifikasiEmail} onCheckedChange={setNotifikasiEmail} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifikasi Pembayaran</Label>
                    <p className="text-sm text-muted-foreground">Notifikasi saat ada pembayaran baru</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Reminder Tunggakan</Label>
                    <p className="text-sm text-muted-foreground">Pengingat otomatis untuk tunggakan</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Laporan Mingguan</Label>
                    <p className="text-sm text-muted-foreground">Kirim laporan mingguan ke admin</p>
                  </div>
                  <Switch />
                </div>
              </div>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Simpan Notifikasi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}