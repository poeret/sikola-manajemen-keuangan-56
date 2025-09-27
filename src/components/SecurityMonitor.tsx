import { useEffect, useState } from 'react';
import { securityManager } from '@/lib/security';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface SecurityStatus {
  headersValid: boolean;
  rateLimitStatus: 'normal' | 'warning' | 'critical';
  sessionActive: boolean;
  lastActivity: Date | null;
}

export const SecurityMonitor = () => {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    headersValid: false,
    rateLimitStatus: 'normal',
    sessionActive: false,
    lastActivity: null
  });

  useEffect(() => {
    // Check security status
    const checkSecurity = () => {
      const headersValid = securityManager.validateSecurityHeaders();
      const sessionActive = !!localStorage.getItem('sb-cmsvmhcxmsznhpbsvopw-auth-token');
      
      setSecurityStatus({
        headersValid,
        rateLimitStatus: 'normal', // This would be dynamic in real implementation
        sessionActive,
        lastActivity: sessionActive ? new Date() : null
      });
    };

    checkSecurity();
    const interval = setInterval(checkSecurity, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2">
      <Alert className="w-80">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {securityStatus.headersValid ? (
                <CheckCircle className="h-3 w-3 text-green-500" />
              ) : (
                <AlertTriangle className="h-3 w-3 text-red-500" />
              )}
              <span className="text-xs">
                Headers: {securityStatus.headersValid ? 'Valid' : 'Invalid'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${
                securityStatus.rateLimitStatus === 'normal' ? 'bg-green-500' :
                securityStatus.rateLimitStatus === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-xs">
                Rate Limit: {securityStatus.rateLimitStatus}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${
                securityStatus.sessionActive ? 'bg-green-500' : 'bg-gray-400'
              }`} />
              <span className="text-xs">
                Session: {securityStatus.sessionActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
