import { CheckCircle, XCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

type Stats = {
  total: number;
  pass: number;
  fail: number;
};

export default function StatusCard({
  title,
  stats,
  icon,
  description,
}: {
  title: string;
  stats: Stats | null;
  icon: React.ReactNode;
  description: string;
}) {
  if (!stats)
    return (
      <Card className="animate-pulse h-56 shadow-xl rounded-2xl flex flex-col justify-between p-6 bg-[#18181b] border border-slate-700">
        <div className="flex flex-row items-center gap-4 pb-2">
          <div className="w-10 h-10 bg-slate-700 rounded-full animate-pulse" />
          <div className="flex-1">
            <div className="h-5 w-32 bg-slate-700 rounded mb-2 animate-pulse" />
            <div className="h-3 w-48 bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="pt-2">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-6 h-6 bg-slate-700 rounded-full animate-pulse" />
            <div className="h-6 w-12 bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-16 bg-slate-700 rounded animate-pulse" />
          </div>
          <div className="flex gap-6 text-sm mt-2">
            <div className="h-4 w-16 bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-16 bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-16 bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
      </Card>
    );

  const { total, pass, fail } = stats;
  const passRate = total ? ((pass / total) * 100).toFixed(0) : '0';

  return (
    <Card className="shadow-xl rounded-2xl transition-transform hover:scale-[1.025] hover:shadow-2xl hover:cursor-pointer bg-[#18181b] border border-slate-700 gap-4">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="flex-shrink-0">{icon}</div>
        <div>
          <CardTitle className="text-xl font-bold text-slate-100 text-left">
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-slate-400 text-left mt-1">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-center gap-4 mb-3">
          {fail === 0 ? (
            <CheckCircle className="w-6 h-6 text-emerald-500 animate-bounce" />
          ) : (
            <XCircle className="w-6 h-6 text-rose-500 animate-pulse" />
          )}
          <span className="text-2xl font-semibold text-slate-100">
            {passRate}%
          </span>
          <span className="text-slate-400 text-sm">compliant</span>
        </div>
        <div className="flex gap-6 text-sm">
          <span className="text-indigo-400">Passing: {pass}</span>
          <span className="text-rose-400">Failing: {fail}</span>
          <span className="text-slate-400">Total: {total}</span>
        </div>
      </CardContent>
    </Card>
  );
}
