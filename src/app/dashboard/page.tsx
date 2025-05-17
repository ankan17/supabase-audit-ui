'use client';

import { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { Loader2, RefreshCw, ShieldCheck, ShieldX } from 'lucide-react';

import { API } from '../../lib/constants';
import StatusCard from '../../components/StatusCard';
import toast, { Toaster } from 'react-hot-toast';

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' })
    .then((res) => res.json())
    .then((res) => res.data ?? res);

const checks = [
  {
    id: 'mfa',
    title: 'Multi‑Factor Authentication',
    description: 'Ensures users have MFA enabled for extra security.',
    icon: <ShieldCheck className="w-8 h-8 text-indigo-500" />,
    url: API.CHECKS_MFA,
  },
  {
    id: 'rls',
    title: 'Row‑Level Security',
    description: 'Protects data at the row level for granular access control.',
    icon: <ShieldX className="w-8 h-8 text-indigo-500" />,
    url: API.CHECKS_RLS,
  },
  {
    id: 'pitr',
    title: 'Point‑in‑Time Recovery',
    description: 'Allows recovery of data to any point in time.',
    icon: <RefreshCw className="w-8 h-8 text-indigo-500" />,
    url: API.CHECKS_PITR,
  },
];

type CheckResult = (typeof checks)[number];

export default function Dashboard() {
  const [scanLoading, setScanLoading] = useState(false);
  const [scanResults, setScanResults] = useState<
    (
      | (CheckResult & {
          data: {
            total: number;
            pass: number;
            fail: number;
          };
        })
      | null
    )[]
  >([]);

  const {
    data: organisations,
    error: orgsError,
    isLoading: orgsLoading,
  } = useSWR<
    {
      id: string;
      name: string;
    }[]
  >(API.USERS_SUPABASE_ORGANISATIONS, fetcher);

  if (orgsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader
          size={48}
          color="var(--color-emerald-500)"
          aria-label="Loading..."
        />
      </div>
    );
  }

  if (orgsError) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error: {orgsError.message}
      </div>
    );
  }

  const selectedOrg = organisations?.[0] || { id: null, name: 'Not selected' };

  const handleRunScan = async () => {
    setScanLoading(true);
    try {
      const settledResults = await Promise.allSettled(
        checks.map((check) =>
          axios
            .get(`${check.url}?orgId=${selectedOrg.id}`, {
              withCredentials: true,
            })
            .then((res) => ({ ...check, data: res.data.data }))
        )
      );
      const results = settledResults.map((result, i) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          toast.error(`Failed to fetch results for ${checks[i].id} check`);
          return null;
        }
      });
      setScanResults(results);
    } catch (error) {
      console.error(error);
    } finally {
      setScanLoading(false);
    }
  };

  return (
    <div className="py-16 px-4 sm:px-8">
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
      <header className="mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-100 mb-3">
          Compliance Dashboard ({selectedOrg.name})
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Instantly check your organization&rsquo;s security and compliance
          posture.
        </p>
        <div className="mt-12 flex justify-center">
          {/* Run Scan Button */}
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-500 bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            onClick={handleRunScan}
            disabled={!selectedOrg || scanLoading}
          >
            {scanLoading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {scanLoading ? 'Running Scan...' : 'Run Scan'}
          </button>
        </div>

        {scanResults.length > 0 && (
          <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 mt-12">
            {scanResults.map((result) =>
              result ? (
                <StatusCard
                  key={result.id}
                  title={result.title}
                  stats={result.data}
                  icon={result.icon}
                  description={result.description}
                />
              ) : null
            )}
          </div>
        )}
      </header>
    </div>
  );
}
