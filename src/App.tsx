import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import TahunAjaran from "./pages/TahunAjaran";
import DataSiswa from "./pages/DataSiswa";
import DetailSiswa from "./pages/DetailSiswa";
import PembayaranSPP from "./pages/PembayaranSPP";
import Lembaga from "./pages/Lembaga";
import Kelas from "./pages/Kelas";
import Tagihan from "./pages/Tagihan";
import ManajemenPengguna from "./pages/ManajemenPengguna";
import KategoriBeasiswa from "./pages/KategoriBeasiswa";
import KenaikanKelas from "./pages/KenaikanKelas";
import KategoriKeuangan from "./pages/KategoriKeuangan";
import RencanaKegiatan from "./pages/RencanaKegiatan";
import RealisasiKegiatan from "./pages/RealisasiKegiatan";
import BukuKas from "./pages/BukuKas";
import LaporanPembayaran from "./pages/LaporanPembayaran";
import LaporanKeuangan from "./pages/LaporanKeuangan";
import Pengaturan from "./pages/Pengaturan";
import NotFound from "./pages/NotFound";
import { AppLayout } from "./components/AppLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminOnly, CashierOnly } from "./components/RoleGuard";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SupabaseWrapper } from "./components/SupabaseWrapper";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
              <SupabaseWrapper>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout>
                  <Index />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/tahun-ajaran" element={
              <ProtectedRoute>
                <AdminOnly>
                  <AppLayout>
                    <TahunAjaran />
                  </AppLayout>
                </AdminOnly>
              </ProtectedRoute>
            } />
            <Route path="/lembaga" element={
              <ProtectedRoute>
                <AdminOnly>
                  <AppLayout>
                    <Lembaga />
                  </AppLayout>
                </AdminOnly>
              </ProtectedRoute>
            } />
            <Route path="/kelas" element={
              <ProtectedRoute>
                <AdminOnly>
                  <AppLayout>
                    <Kelas />
                  </AppLayout>
                </AdminOnly>
              </ProtectedRoute>
            } />
            <Route path="/tagihan" element={
              <ProtectedRoute>
                <AdminOnly>
                  <AppLayout>
                    <Tagihan />
                  </AppLayout>
                </AdminOnly>
              </ProtectedRoute>
            } />
            <Route path="/pengguna" element={
              <ProtectedRoute>
                <AdminOnly>
                  <AppLayout>
                    <ManajemenPengguna />
                  </AppLayout>
                </AdminOnly>
              </ProtectedRoute>
            } />
            <Route path="/beasiswa" element={
              <ProtectedRoute>
                <AdminOnly>
                  <AppLayout>
                    <KategoriBeasiswa />
                  </AppLayout>
                </AdminOnly>
              </ProtectedRoute>
            } />
            <Route path="/siswa" element={
              <ProtectedRoute>
                <AdminOnly>
                  <AppLayout>
                    <DataSiswa />
                  </AppLayout>
                </AdminOnly>
              </ProtectedRoute>
            } />
            <Route path="/siswa/:id" element={
              <ProtectedRoute>
                <AdminOnly>
                  <AppLayout>
                    <DetailSiswa />
                  </AppLayout>
                </AdminOnly>
              </ProtectedRoute>
            } />
            <Route path="/kenaikan-kelas" element={
              <ProtectedRoute>
                <AdminOnly>
                  <AppLayout>
                    <KenaikanKelas />
                  </AppLayout>
                </AdminOnly>
              </ProtectedRoute>
            } />
            <Route path="/pembayaran-spp" element={
              <ProtectedRoute>
                <AppLayout>
                  <PembayaranSPP />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/kategori-keuangan" element={
              <ProtectedRoute>
                <AdminOnly>
                  <AppLayout>
                    <KategoriKeuangan />
                  </AppLayout>
                </AdminOnly>
              </ProtectedRoute>
            } />
            <Route path="/rencana-kegiatan" element={
              <ProtectedRoute>
                <AdminOnly>
                  <AppLayout>
                    <RencanaKegiatan />
                  </AppLayout>
                </AdminOnly>
              </ProtectedRoute>
            } />
            <Route path="/realisasi-kegiatan" element={
              <ProtectedRoute>
                <AdminOnly>
                  <AppLayout>
                    <RealisasiKegiatan />
                  </AppLayout>
                </AdminOnly>
              </ProtectedRoute>
            } />
            <Route path="/buku-kas" element={
              <ProtectedRoute>
                <AdminOnly>
                  <AppLayout>
                    <BukuKas />
                  </AppLayout>
                </AdminOnly>
              </ProtectedRoute>
            } />
            <Route path="/laporan-pembayaran" element={
              <ProtectedRoute>
                <AppLayout>
                  <LaporanPembayaran />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/laporan-keuangan" element={
              <ProtectedRoute>
                <AdminOnly>
                  <AppLayout>
                    <LaporanKeuangan />
                  </AppLayout>
                </AdminOnly>
              </ProtectedRoute>
            } />
            <Route path="/pengaturan" element={
              <ProtectedRoute>
                <AppLayout>
                  <Pengaturan />
                </AppLayout>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
              </Routes>
                </BrowserRouter>
              </SupabaseWrapper>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
