'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import axios from 'axios';

import { API } from '../lib/constants';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await axios.post(API.AUTH_LOGOUT, {}, { withCredentials: true });
    router.replace('/');
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-[#18181b] shadow-sm backdrop-blur z-50 sticky top-0">
      <a href="/dashboard" className="text-xl font-bold tracking-tight text-white select-none">
        Supabase Audit
      </a>
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="p-2 rounded-full border border-transparent hover:border-rose-600 focus:border-rose-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/70 transition hover:bg-rose-900 group relative cursor-pointer"
          aria-label="Logout"
          type="button"
          role="button"
        >
          <LogOut className="w-5 h-5 text-rose-600" />
          <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 text-xs rounded bg-black text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap">
            Logout
          </span>
        </button>
      </div>
    </nav>
  );
}
