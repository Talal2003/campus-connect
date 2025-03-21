'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './authContext';

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login page if user is not authenticated
      router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
    }
  }, [user, loading, router]);

  // Show nothing while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            border: '4px solid var(--primary-blue)',
            borderTop: '4px solid var(--primary-yellow)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            margin: '0 auto 20px auto',
            animation: 'spin 1s linear infinite',
          }} />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children
  if (!user) {
    return null;
  }

  // If authenticated, render children
  return children;
} 