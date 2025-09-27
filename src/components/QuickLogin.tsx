import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, User, Shield } from 'lucide-react';

export const QuickLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleQuickLogin = async (role: 'admin' | 'cashier') => {
    setIsLoading(true);
    
    // Simulate quick login without Supabase
    setTimeout(() => {
      const userData = {
        id: role === 'admin' ? 'admin-1' : 'cashier-1',
        email: role === 'admin' ? 'admin@sekolah.sch.id' : 'kasir@sekolah.sch.id',
        name: role === 'admin' ? 'Administrator Sekolah' : 'Kasir Sekolah',
        role: role === 'admin' ? 'super_admin' as const : 'cashier' as const
      };
      
      // Set user directly in localStorage for quick access
      localStorage.setItem('sikola_user', JSON.stringify(userData));
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-xl">Quick Login Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            Supabase tidak dapat diakses. Gunakan mode quick login untuk melanjutkan.
          </p>

          <div className="space-y-3">
            <Button 
              onClick={() => handleQuickLogin('admin')} 
              className="w-full h-12"
              disabled={isLoading}
            >
              <Shield className="w-4 h-4 mr-2" />
              Login sebagai Admin
            </Button>
            
            <Button 
              onClick={() => handleQuickLogin('cashier')} 
              variant="outline"
              className="w-full h-12"
              disabled={isLoading}
            >
              <User className="w-4 h-4 mr-2" />
              Login sebagai Kasir
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center space-y-1">
            <p><strong>Admin:</strong> Akses penuh ke semua fitur</p>
            <p><strong>Kasir:</strong> Akses terbatas untuk pembayaran</p>
          </div>

          <div className="pt-4 border-t">
            <Button 
              onClick={() => window.location.reload()} 
              variant="ghost" 
              className="w-full"
            >
              Coba Koneksi Supabase Lagi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
