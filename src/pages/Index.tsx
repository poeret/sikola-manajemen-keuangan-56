import { useState } from "react";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";
import { CashierDashboard } from "@/components/dashboard/CashierDashboard";
import { Button } from "@/components/ui/button";

const Index = () => {
  // Mock user role - in real app this would come from auth context
  const [userRole, setUserRole] = useState<"superadmin" | "cashier">("superadmin");

  return (
    <div className="space-y-6">
      {/* Demo role switcher - remove in production */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <span className="text-sm font-medium">Demo Mode - Pilih Role:</span>
        <Button 
          variant={userRole === "superadmin" ? "default" : "outline"} 
          size="sm"
          onClick={() => setUserRole("superadmin")}
        >
          Super Admin
        </Button>
        <Button 
          variant={userRole === "cashier" ? "default" : "outline"} 
          size="sm"
          onClick={() => setUserRole("cashier")}
        >
          Kasir
        </Button>
      </div>

      {userRole === "superadmin" ? (
        <SuperAdminDashboard />
      ) : (
        <CashierDashboard />
      )}
    </div>
  );
};

export default Index;
