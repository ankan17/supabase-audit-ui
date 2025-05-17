'use client';

import { API } from '@/lib/constants';
import { ShieldCheck, LogIn } from 'lucide-react';

export default function Login() {
  return (
    <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl border border-indigo-700 bg-[#23272f]">
      <div className="flex flex-col items-center mb-6">
        <ShieldCheck className="w-12 h-12 text-indigo-500 mb-2" />
        <h1 className="text-2xl font-bold text-white mb-1">
          Delve Compliance Audit
        </h1>
        <p className="text-slate-400 text-center text-sm">
          Sign in to scan your Supabase project for compliance.
        </p>
      </div>
      <div className="mt-8">
        <a
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow transition cursor-pointer"
          href={API.AUTH_LOGIN}
        >
          <LogIn className="w-5 h-5" />
          Sign in with Supabase
        </a>
      </div>
      <div className="mt-6 text-xs text-slate-500 text-center">
        We&apos;ll never store your credentials. Authentication is used only to
        run compliance checks on your behalf.
      </div>
    </div>
  );
}
