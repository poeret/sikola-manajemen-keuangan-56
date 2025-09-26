import {
  BookOpen,
  Users,
  CreditCard,
  TrendingUp,
  FileText,
  Settings,
  Home,
  GraduationCap,
  Building,
  PlusCircle,
  DollarSign,
  Receipt,
  Calculator,
  BarChart3,
  FolderOpen,
  Award,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import schoolLogo from "@/assets/school-logo.png";

const menuItems = [
  {
    title: "Beranda",
    items: [
      { title: "Dashboard", url: "/", icon: Home },
    ],
  },
  {
    title: "Master Data",
    items: [
      { title: "Tahun Ajaran", url: "/tahun-ajaran", icon: BookOpen },
      { title: "Lembaga", url: "/lembaga", icon: Building },
      { title: "Kelas", url: "/kelas", icon: GraduationCap },
      { title: "Tagihan", url: "/tagihan", icon: Receipt },
      { title: "Manajemen Pengguna", url: "/pengguna", icon: Users },
      { title: "Kategori Beasiswa", url: "/beasiswa", icon: Award },
    ],
  },
  {
    title: "Kesiswaan",
    items: [
      { title: "Data Siswa", url: "/siswa", icon: Users },
      { title: "Kenaikan Kelas", url: "/kenaikan-kelas", icon: TrendingUp },
    ],
  },
  {
    title: "Transaksi",
    items: [
      { title: "Pembayaran SPP", url: "/pembayaran-spp", icon: CreditCard },
    ],
  },
  {
    title: "Keuangan",
    items: [
      { title: "Kategori Keuangan", url: "/kategori-keuangan", icon: FolderOpen },
      { title: "Rencana Kegiatan", url: "/rencana-kegiatan", icon: PlusCircle },
      { title: "Realisasi Kegiatan", url: "/realisasi-kegiatan", icon: Calculator },
      { title: "Buku Kas Umum", url: "/buku-kas", icon: DollarSign },
    ],
  },
  {
    title: "Laporan",
    items: [
      { title: "Laporan Pembayaran", url: "/laporan-pembayaran", icon: FileText },
      { title: "Laporan Keuangan", url: "/laporan-keuangan", icon: BarChart3 },
    ],
  },
  {
    title: "Sistem",
    items: [
      { title: "Pengaturan", url: "/pengaturan", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isCollapsed = state === "collapsed";
  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium" 
      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

  return (
    <Sidebar className={`${isCollapsed ? "w-14" : "w-64"} bg-sidebar-background`}>
      <SidebarContent className="bg-sidebar-background">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img 
              src={schoolLogo} 
              alt="Logo Sekolah" 
              className="w-8 h-8 rounded-full"
            />
            {!isCollapsed && (
              <div>
                <h2 className="font-semibold text-sm text-sidebar-foreground">SMK Negeri 1</h2>
                <p className="text-xs text-sidebar-foreground/70">Sistem Keuangan</p>
              </div>
            )}
          </div>
        </div>

        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            {!isCollapsed && <SidebarGroupLabel>{group.title}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isActive(item.url);
                  const buttonCls = active
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={active} className={buttonCls}>
                        <NavLink to={item.url} end>
                          <item.icon className="h-4 w-4" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}