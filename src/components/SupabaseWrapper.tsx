import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SupabaseFallback } from './SupabaseFallback';

interface SupabaseWrapperProps {
  children: ReactNode;
}

export const SupabaseWrapper = ({ children }: SupabaseWrapperProps) => {
  const { isLoading, isSupabaseError } = useAuth();

  if (isSupabaseError) {
    return <SupabaseFallback />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">Memuat Aplikasi</p>
            <p className="text-sm text-gray-600">Mohon tunggu sebentar...</p>
          </div>
          <div className="w-64 bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
