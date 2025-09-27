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
  Shield,
  UserCheck,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import schoolLogo from "@/assets/school-logo.png";

// Menu untuk Super Admin
const superAdminMenuItems = [
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

// Menu untuk Kasir (lebih terbatas)
const cashierMenuItems = [
  {
    title: "Beranda",
    items: [
      { title: "Dashboard", url: "/", icon: Home },
    ],
  },
  {
    title: "Transaksi",
    items: [
      { title: "Pembayaran SPP", url: "/pembayaran-spp", icon: CreditCard },
    ],
  },
  {
    title: "Laporan",
    items: [
      { title: "Laporan Pembayaran", url: "/laporan-pembayaran", icon: FileText },
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
  const { user } = useAuth();
  const currentPath = location.pathname;
  
  // State untuk mengontrol collapse/expand sub menu
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  const isActive = (path: string) => currentPath === path;
  
  // Fungsi untuk toggle collapse/expand sub menu
  const toggleMenu = (menuTitle: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuTitle)) {
        newSet.delete(menuTitle);
      } else {
        newSet.add(menuTitle);
      }
      return newSet;
    });
  };
  
  // Tentukan menu berdasarkan role
  const getMenuItems = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'super_admin':
      case 'admin':
        return superAdminMenuItems;
      case 'cashier':
        return cashierMenuItems;
      default:
        return cashierMenuItems; // Default ke kasir untuk role lain
    }
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar 
      className="bg-sidebar-background"
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar-background">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img 
              src={schoolLogo} 
              alt="Logo Sekolah" 
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-sm text-sidebar-foreground truncate">SMK Negeri 1</h2>
              <p className="text-xs text-sidebar-foreground/70 truncate">Sistem Keuangan</p>
            </div>
          </div>
        </div>

        {/* Role Badge */}
        {user && (
          <div className="px-4 py-2 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              {user.role === 'super_admin' || user.role === 'admin' ? (
                <Shield className="w-4 h-4 text-blue-500 flex-shrink-0" />
              ) : (
                <UserCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
              )}
              <span className="text-xs font-medium text-sidebar-foreground truncate">
                {user.role === 'super_admin' ? 'Super Admin' : 
                 user.role === 'admin' ? 'Administrator' : 
                 user.role === 'cashier' ? 'Kasir' : 'User'}
              </span>
            </div>
          </div>
        )}

        {menuItems.map((group) => {
          const isExpanded = expandedMenus.has(group.title);
          const hasItems = group.items && group.items.length > 0;
          
          return (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel 
                className="px-4 py-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider cursor-pointer hover:bg-sidebar-accent/50 transition-colors"
                onClick={() => hasItems && toggleMenu(group.title)}
              >
                <div className="flex items-center justify-between">
                  <span>{group.title}</span>
                  {hasItems && (
                    <div className="transition-transform duration-200">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </div>
              </SidebarGroupLabel>
              
              {hasItems && (
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => {
                        const active = isActive(item.url);
                        const buttonCls = active
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

                        return (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton 
                              asChild 
                              isActive={active} 
                              className={`${buttonCls} transition-colors duration-200`}
                            >
                              <NavLink to={item.url} end className="flex items-center gap-3">
                                <item.icon className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{item.title}</span>
                              </NavLink>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </div>
              )}
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}