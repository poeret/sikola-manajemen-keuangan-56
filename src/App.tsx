import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import TahunAjaran from "./pages/TahunAjaran";
import DataSiswa from "./pages/DataSiswa";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <AppLayout>
              <Index />
            </AppLayout>
          } />
          <Route path="/tahun-ajaran" element={
            <AppLayout>
              <TahunAjaran />
            </AppLayout>
          } />
          <Route path="/lembaga" element={
            <AppLayout>
              <Lembaga />
            </AppLayout>
          } />
          <Route path="/kelas" element={
            <AppLayout>
              <Kelas />
            </AppLayout>
          } />
          <Route path="/tagihan" element={
            <AppLayout>
              <Tagihan />
            </AppLayout>
          } />
          <Route path="/pengguna" element={
            <AppLayout>
              <ManajemenPengguna />
            </AppLayout>
          } />
          <Route path="/beasiswa" element={
            <AppLayout>
              <KategoriBeasiswa />
            </AppLayout>
          } />
          <Route path="/siswa" element={
            <AppLayout>
              <DataSiswa />
            </AppLayout>
          } />
          <Route path="/kenaikan-kelas" element={
            <AppLayout>
              <KenaikanKelas />
            </AppLayout>
          } />
          <Route path="/pembayaran-spp" element={
            <AppLayout>
              <PembayaranSPP />
            </AppLayout>
          } />
          <Route path="/kategori-keuangan" element={
            <AppLayout>
              <KategoriKeuangan />
            </AppLayout>
          } />
          <Route path="/rencana-kegiatan" element={
            <AppLayout>
              <RencanaKegiatan />
            </AppLayout>
          } />
          <Route path="/realisasi-kegiatan" element={
            <AppLayout>
              <RealisasiKegiatan />
            </AppLayout>
          } />
          <Route path="/buku-kas" element={
            <AppLayout>
              <BukuKas />
            </AppLayout>
          } />
          <Route path="/laporan-pembayaran" element={
            <AppLayout>
              <LaporanPembayaran />
            </AppLayout>
          } />
          <Route path="/laporan-keuangan" element={
            <AppLayout>
              <LaporanKeuangan />
            </AppLayout>
          } />
          <Route path="/pengaturan" element={
            <AppLayout>
              <Pengaturan />
            </AppLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
