import { useAuth } from '@/contexts/AuthContext';

export const DebugAuth = () => {
  const { user, isLoading, isSupabaseError } = useAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50">
      <div className="space-y-1">
        <div>Loading: {isLoading ? 'true' : 'false'}</div>
        <div>Supabase Error: {isSupabaseError ? 'true' : 'false'}</div>
        <div>User: {user ? 'logged in' : 'not logged in'}</div>
        {user && (
          <>
            <div>Role: {user.role}</div>
            <div>Email: {user.email}</div>
          </>
        )}
      </div>
    </div>
  );
};
