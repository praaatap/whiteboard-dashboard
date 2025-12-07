"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/(service)/auth.service';

export function useAuth(requireAuth = true) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (hasChecked) return;

    const checkAuth = async () => {
      try {
        const token = authService.getToken();
        
        if (!token) {
          console.log('No token found');
          if (requireAuth) {
            router.push('/login');
          }
          setLoading(false);
          setHasChecked(true);
          return;
        }

        // Get user from localStorage first (instant, always works)
        const localUser = authService.getUser();
        
        if (localUser) {
          console.log('User loaded from localStorage:', localUser.email);
          setUser(localUser);
          setLoading(false);
          setHasChecked(true);
          
          // ✅ OPTIONAL: Try to verify with backend in background (don't block UI)
          authService.getCurrentUser()
            .then(backendUser => {
              console.log('Backend user verified:', backendUser.email);
              setUser(backendUser);
              authService.setUser(backendUser);
            })
            .catch(err => {
              console.warn('Could not verify with backend (using localStorage):', err.message);
              // Keep using localStorage user
            });
        } else {
          // Has token but no user - try to fetch from backend
          try {
            const currentUser = await authService.getCurrentUser();
            console.log('User fetched from backend:', currentUser.email);
            setUser(currentUser);
            authService.setUser(currentUser);
          } catch (error) {
            console.error('Failed to get user from backend:', error);
            authService.clearAuth();
            if (requireAuth) {
              router.push('/login');
            }
          } finally {
            setLoading(false);
            setHasChecked(true);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authService.clearAuth();
        if (requireAuth) {
          router.push('/login');
        }
        setLoading(false);
        setHasChecked(true);
      }
    };

    checkAuth();
  }, [hasChecked, requireAuth, router]);

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setHasChecked(false);
    router.push('/login');
  };

  return { user, loading, logout };
}
