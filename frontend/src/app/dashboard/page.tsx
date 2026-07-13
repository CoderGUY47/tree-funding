'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardRouter() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role === 'Admin') {
          router.replace('/dashboard/admin');
        } else if (user.role === 'Creator') {
          router.replace('/dashboard/creator');
        } else {
          router.replace('/dashboard/supporter');
        }
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-96 items-center justify-center bg-zinc-950">
      <div className="h-10 w-10 rounded-full border-4 border-zinc-800 border-t-emerald-500 animate-spin" />
    </div>
  );
}
