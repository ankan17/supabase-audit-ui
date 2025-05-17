'use client';

import { ShieldCheck, LogIn } from 'lucide-react';

export default function Login() {
  const handleLogin = async () => {
    console.log('Login');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e293b]">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl border border-slate-800 bg-[#18181b]">
        <div className="flex flex-col items-center mb-6">
          <ShieldCheck className="w-12 h-12 text-emerald-400 mb-2" />
          <h1 className="text-2xl font-bold text-white mb-1">
            Delve Compliance Audit
          </h1>
          <p className="text-slate-400 text-center text-sm">
            Sign in to scan your Supabase project for compliance.
          </p>
        </div>
        <div className="mt-8">
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow transition cursor-pointer"
            onClick={handleLogin}
          >
            <LogIn className="w-5 h-5" />
            Sign in with Supabase
          </button>
        </div>
        <div className="mt-6 text-xs text-slate-500 text-center">
          We’ll never store your credentials. Authentication is used only to run compliance checks on your behalf.
        </div>
      </div>
    </main>
  );
}
