import { Bell, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";

const pageNames: Record<string, string> = {
  "/": "Dashboard",
  "/tahun-ajaran": "Master Tahun Ajaran",
  "/lembaga": "Master Lembaga",
  "/kelas": "Master Kelas",
  "/tagihan": "Master Tagihan",
  "/pengguna": "Manajemen Pengguna",
  "/beasiswa": "Kategori Beasiswa",
  "/siswa": "Data Siswa",
  "/kenaikan-kelas": "Kenaikan Kelas",
  "/pembayaran-spp": "Pembayaran SPP",
  "/kategori-keuangan": "Kategori Keuangan",
  "/rencana-kegiatan": "Rencana Kegiatan",
  "/realisasi-kegiatan": "Realisasi Kegiatan",
  "/buku-kas": "Buku Kas Umum",
  "/laporan-pembayaran": "Laporan Pembayaran",
  "/laporan-keuangan": "Laporan Keuangan",
  "/pengaturan": "Pengaturan",
  "/login": "Login",
};

export function AppHeader() {
  const location = useLocation();
  const currentPageName = pageNames[location.pathname] || "Halaman";
  
  // Mock user data - in real app, this would come from auth context
  const user = {
    name: "Admin Sekolah",
    role: "Super Admin",
    email: "admin@smkn1.sch.id"
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logout clicked");
  };

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold text-foreground">{currentPageName}</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}