'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';

// Sync next-auth session into localStorage so legacy components that read
// auth_user continue to work for OAuth logins.
function AuthUserSync() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const userData = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || session.user.email?.split('@')[0],
        role: session.user.role || 'user',
      };
      localStorage.setItem('auth_user', JSON.stringify(userData));
      window.dispatchEvent(new Event('user-login'));
    } else if (status === 'unauthenticated') {
      localStorage.removeItem('auth_user');
    }
  }, [status, session]);

  return null;
}

export default function NextAuthProvider({ children }) {
  return (
    <SessionProvider>
      <AuthUserSync />
      {children}
    </SessionProvider>
  );
}
