import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { securityManager } from '@/lib/security';
import { emailSchema, passwordSchema } from '@/lib/validation';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'cashier' | 'teacher';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseError, setIsSupabaseError] = useState(false);
  const [fetchedUsers, setFetchedUsers] = useState<Set<string>>(new Set());
  const [sessionTimeoutId, setSessionTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Timeout untuk mencegah loading yang terlalu lama
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // Check current session
    const getCurrentSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          setIsLoading(false);
          return;
        }
        
        if (session?.user) {
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        setIsSupabaseError(true);
      } finally {
        clearTimeout(timeout);
        setIsLoading(false);
      }
    };

    getCurrentSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            clearTimeout(timeout);
            if (session?.user) {
              await fetchUserProfile(session.user);
            } else {
              setUser(null);
            }
            setIsLoading(false);
          }
        );

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    // Cek apakah user sudah pernah di-fetch
    if (fetchedUsers.has(supabaseUser.id)) {
      return;
    }

    try {
      setFetchedUsers(prev => new Set(prev).add(supabaseUser.id));
      
      // Timeout untuk profile fetching
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 2000)
      );
      
      try {
        const { data: profile, error } = await Promise.race([
          profilePromise,
          timeoutPromise
        ]) as any;

        if (error) {
          // Fallback: create user from auth data
          const userData: User = {
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
            role: supabaseUser.email === 'admin@sekolah.sch.id' ? 'super_admin' : 
                  supabaseUser.email === 'kasir@sekolah.sch.id' ? 'cashier' : 'cashier'
          };
          setUser(userData);
          return;
        }

        if (profile && profile.is_active) {
          setUser({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role
          });
          
          // Set session timeout
          const timeoutId = securityManager.setSessionTimeout(() => {
            securityManager.logSecurityEvent('SESSION_TIMEOUT', { userId: profile.id });
            logout();
          });
          setSessionTimeoutId(timeoutId);
        } else {
          // Fallback if profile not found or inactive
          const userData: User = {
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
            role: supabaseUser.email === 'admin@sekolah.sch.id' ? 'super_admin' : 
                  supabaseUser.email === 'kasir@sekolah.sch.id' ? 'cashier' : 'cashier'
          };
          setUser(userData);
          
          // Set session timeout
          const timeoutId = securityManager.setSessionTimeout(() => {
            securityManager.logSecurityEvent('SESSION_TIMEOUT', { userId: userData.id });
            logout();
          });
          setSessionTimeoutId(timeoutId);
        }
      } catch (timeoutError) {
        // Fallback: create user from auth data
        const userData: User = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
          role: supabaseUser.email === 'admin@sekolah.sch.id' ? 'super_admin' : 
                supabaseUser.email === 'kasir@sekolah.sch.id' ? 'cashier' : 'cashier'
        };
        setUser(userData);
        return;
      }
    } catch (error) {
      // Fallback on error
      const userData: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
        role: supabaseUser.email === 'admin@sekolah.sch.id' ? 'super_admin' : 
              supabaseUser.email === 'kasir@sekolah.sch.id' ? 'cashier' : 'cashier'
      };
      setUser(userData);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Validate input
      const validatedEmail = emailSchema.parse(email);
      const validatedPassword = passwordSchema.parse(password);

      // Check rate limiting
      if (!securityManager.checkRateLimit(validatedEmail)) {
        securityManager.logSecurityEvent('RATE_LIMIT_EXCEEDED', { email: validatedEmail });
        setIsLoading(false);
        return false;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: validatedEmail,
        password: validatedPassword,
      });

      if (error) {
        securityManager.logSecurityEvent('LOGIN_FAILED', { 
          email: validatedEmail, 
          error: error.message 
        });
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        // Clear rate limit on successful login
        securityManager.clearRateLimit(validatedEmail);
        securityManager.logSecurityEvent('LOGIN_SUCCESS', { 
          email: validatedEmail,
          userId: data.user.id 
        });
        
        await fetchUserProfile(data.user);
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error: any) {
      securityManager.logSecurityEvent('LOGIN_VALIDATION_ERROR', { 
        email, 
        error: error.message 
      });
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Clear session timeout
      if (sessionTimeoutId) {
        securityManager.clearSessionTimeout(sessionTimeoutId);
        setSessionTimeoutId(null);
      }
      
      securityManager.logSecurityEvent('LOGOUT', { userId: user?.id });
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      // Silent error handling
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
