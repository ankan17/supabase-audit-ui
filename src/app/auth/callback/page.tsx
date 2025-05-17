'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';

import { API } from '@/lib/constants';

export default function SupabaseCallback() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code || !state) {
      toast.error('Something went wrong during sign-in. Please try again.', {
        duration: 3000,
      });
      setTimeout(() => {
        router.replace('/');
      }, 3000);
      return;
    }

    axios
      .post(
        API.AUTH_SUPABASE_CALLBACK,
        { code, state },
        { withCredentials: true }
      )
      .then(() => {
        router.replace('/dashboard');
      })
      .catch((e) => {
        // eslint-disable-next-line quotes
        toast.error("We couldn't sign you in. Please try again.", {
          duration: 3000,
        });
        console.log(e);
        setTimeout(() => {
          router.replace('/');
        }, 3000);
      });
  }, [router]);

  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            background: '#0a0a0a',
            color: '#ededed',
            border: '1px solid #334155',
            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
            fontFamily: 'var(--font-geist-sans), Arial, sans-serif',
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#23272f',
            },
          },
        }}
      />
      <ClipLoader
        size={48}
        color="var(--color-indigo-600)"
        aria-label="Loading"
      />
    </>
  );
}
