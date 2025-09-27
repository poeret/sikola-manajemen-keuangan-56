import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { securityManager } from "@/lib/security";
import { 
  School, 
  Shield, 
  BarChart3, 
  Users, 
  CreditCard, 
  FileText,
  CheckCircle,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react";
import schoolLogo from "@/assets/school-logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const success = await login(email, password);
    if (success) {
      navigate("/");
    } else {
      setError("Email atau password salah. Silakan coba lagi.");
    }
  };

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Dashboard Keuangan",
      description: "Pantau kondisi keuangan sekolah secara real-time"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Manajemen Siswa",
      description: "Kelola data siswa dan pembayaran SPP"
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Pembayaran Digital",
      description: "Sistem pembayaran yang aman dan terintegrasi"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Laporan Otomatis",
      description: "Generate laporan keuangan secara otomatis"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-bounce animation-delay-1000">
          <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center">
            <School className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <div className="absolute top-40 right-20 animate-bounce animation-delay-2000">
          <div className="w-8 h-8 bg-cyan-300 rounded-full flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-cyan-600" />
          </div>
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce animation-delay-3000">
          <div className="w-8 h-8 bg-indigo-300 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
        </div>
        <div className="absolute bottom-20 right-10 animate-bounce animation-delay-4000">
          <div className="w-8 h-8 bg-purple-300 rounded-full flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-xl">
              <img src={schoolLogo} alt="Logo Sekolah" className="w-10 h-10 rounded-lg" />
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
              <h1 className="text-3xl font-bold text-gray-900 drop-shadow-sm">Sikola</h1>
              <p className="text-sm text-gray-700 font-semibold">Manajemen Keuangan</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200 shadow-lg">
            <CheckCircle className="w-4 h-4 mr-1" />
            Sistem Terintegrasi
          </Badge>
        </div>
      </header>

      <div className="flex min-h-screen relative z-10">
        {/* Left Side - Landing Content */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-white p-12 flex-col justify-center relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          
          <div className="max-w-lg relative z-10">
            <div className="mb-8">
              <h2 className="text-5xl font-bold mb-6 leading-tight">
                Kelola Keuangan Sekolah
                <span className="block text-blue-200 animate-pulse">Dengan Mudah</span>
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Sistem manajemen keuangan sekolah yang modern, aman, dan mudah digunakan. 
                Kelola SPP, laporan keuangan, dan data siswa dalam satu platform terintegrasi.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 group hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white group-hover:bg-white/30 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-blue-200">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-6 text-sm text-blue-200">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Keamanan Terjamin</span>
              </div>
              <div className="flex items-center space-x-2">
                <School className="w-4 h-4" />
                <span>Terintegrasi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
                <img src={schoolLogo} alt="Logo Sekolah" className="w-16 h-16 rounded-xl" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3 drop-shadow-sm">Selamat Datang</h1>
              <p className="text-gray-700 text-lg font-medium">Masuk ke akun Anda untuk mengakses dashboard</p>
            </div>

            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@sekolah.sch.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 border-gray-200 focus:border-primary focus:ring-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-12 border-gray-200 focus:border-primary focus:ring-primary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-gray-600">Ingat saya</span>
                    </label>
                    <a href="#" className="text-primary hover:text-primary/80 font-medium">
                      Lupa password?
                    </a>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Memproses...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Masuk ke Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h4>
                  <div className="space-y-1 text-xs text-blue-700">
                    <p><strong>Super Admin:</strong> admin@sekolah.sch.id / admin123</p>
                    <p><strong>Kasir:</strong> kasir@sekolah.sch.id / kasir123</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-center text-sm text-gray-600">
                    Belum punya akun? 
                    <a href="#" className="text-primary hover:text-primary/80 font-medium ml-1">
                      Hubungi Administrator
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                © 2024 Sikola Manajemen Keuangan. Semua hak dilindungi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}