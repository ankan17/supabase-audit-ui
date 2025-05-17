'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';

import Navbar from '../components/Navbar';
import { API } from '../lib/constants';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const isPublicPage = pathname === '/' || pathname === '/auth/callback';

  useEffect(() => {
    axios
      .get(API.AUTH_VERIFY, { withCredentials: true })
      .then((res) => setAuthenticated(res.status === 200))
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, [pathname]);

  useEffect(() => {
    if (!loading) {
      if (!authenticated && !isPublicPage) {
        router.replace('/');
      }
      if (authenticated && isPublicPage) {
        router.replace('/dashboard');
      }
    }
  }, [loading, authenticated, isPublicPage, router]);

  if (loading) {
    return (
      <ClipLoader
        size={48}
        color="var(--color-emerald-500)"
        aria-label="Loading"
      />
    );
  }

  // Only render children if on the correct page
  if ((!authenticated && !isPublicPage) || (authenticated && isPublicPage)) {
    return null;
  }

  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div className="w-full h-full flex flex-col flex-1">{children}</div>
    </>
  );
}
