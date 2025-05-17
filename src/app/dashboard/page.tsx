'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  ShieldCheck,
  ShieldX,
} from 'lucide-react';

import { API } from '../../lib/constants';
import StatusCard from '../../components/StatusCard';
import ChatWindow from '../../components/ChatWindow';
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
          logs: {
            timestamp: string;
            logGroup: string;
            logline: string;
          }[];
        })
      | null
    )[]
  >([]);
  const [showLogs, setShowLogs] = useState(false);

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

  const selectedOrg = organisations?.[0] || { id: null, name: 'Not selected' };

  const handleRunScan = async () => {
    setScanLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    try {
      const settledResults = await Promise.allSettled(
        checks.map((check) =>
          axios
            .get(`${check.url}?orgId=${selectedOrg.id}`, {
              withCredentials: true,
            })
            .then((res) => ({
              ...check,
              data: {
                total: res.data.data.total,
                pass: res.data.data.pass,
                fail: res.data.data.fail,
              },
              logs: res.data.data.logs,
            }))
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

  const handleToggleLogs = () => {
    setShowLogs((val) => !val);
  };

  const logs = useMemo(() => {
    return scanResults
      .flatMap((result) => result?.logs || [])
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
  }, [scanResults]);

  // Download logs as a .txt file
  const handleDownloadLogs = () => {
    if (!logs.length) return;
    const logText = logs
      .map((log) => {
        const time = log.timestamp
          ? `[${new Date(log.timestamp).toLocaleDateString()} ${new Date(log.timestamp).toLocaleTimeString()}]`
          : '[--/--/---- --:--:--]';
        return `${time} [${log.logGroup.toUpperCase()}] ${log.logline}`;
      })
      .join('\n');
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-logs-${selectedOrg.name || 'org'}.txt`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  if (orgsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader
          size={48}
          color="var(--color-indigo-600)"
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
      <div className="mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-100 mb-3">
          Compliance Dashboard ({selectedOrg.name})
        </h1>
        <p className="text-lg text-slate-400">
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

        {scanLoading && (
          <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 mt-12">
            {Array.from({ length: 3 }).map((_, i) => (
              <StatusCard
                key={`skeleton-${i}`}
                title=""
                stats={null}
                icon={null}
                description=""
              />
            ))}
          </div>
        )}

        {scanResults.length > 0 && (
          <>
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

            <div className="mt-12">
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-500 bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition cursor-pointer"
                  onClick={handleToggleLogs}
                >
                  {showLogs ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  {showLogs ? 'Hide Logs' : 'View Logs'}
                </button>
                <button
                  className="ml-4 flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-500 bg-slate-800 text-white font-semibold shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 transition cursor-pointer"
                  onClick={handleDownloadLogs}
                >
                  Download Logs
                </button>
              </div>
              {showLogs && (
                <div className="mt-4 bg-slate-900 rounded-lg border border-slate-700 p-4 max-h-64 overflow-y-auto text-xs font-mono text-slate-200">
                  <ul>
                    {logs.map((log, idx) => {
                      // Determine highlight class
                      let highlight = '';
                      if (/enabled|passed|success/i.test(log.logline)) {
                        highlight = 'text-emerald-600 font-semibold';
                      } else if (/disabled|failed|error/i.test(log.logline)) {
                        highlight = 'text-rose-600 font-semibold';
                      } else {
                        highlight = 'text-slate-200';
                      }
                      return (
                        <li
                          key={idx}
                          className={`flex items-start gap-2 px-2 py-1 border-l-4 ${
                            idx % 2 === 0
                              ? 'bg-[#23272f] border-indigo-700'
                              : 'bg-slate-800 border-indigo-800'
                          }`}
                        >
                          <span className="text-[10px] text-slate-400 min-w-[140px] select-none">
                            {log.timestamp
                              ? `[${new Date(log.timestamp).toLocaleDateString()} ${new Date(log.timestamp).toLocaleTimeString()}]`
                              : '[--/--/---- --:--:--]'}
                          </span>
                          <span className="text-slate-400 min-w-[50px] select-none text-left">
                            [{log.logGroup.toUpperCase()}]
                          </span>
                          <span
                            className={`whitespace-pre-wrap break-words ${highlight} text-left`}
                          >
                            {log.logline}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <ChatWindow />
    </div>
  );
}
