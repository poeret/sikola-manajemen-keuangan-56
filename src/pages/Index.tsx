import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";
import { CashierDashboard } from "@/components/dashboard/CashierDashboard";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  // Tampilkan dashboard berdasarkan role
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  // Dashboard berdasarkan role
  switch (user.role) {
    case 'super_admin':
    case 'admin':
      return <SuperAdminDashboard />;
    case 'cashier':
      return <CashierDashboard />;
    default:
      return <CashierDashboard />; // Default ke kasir
  }
};

export default Index;
