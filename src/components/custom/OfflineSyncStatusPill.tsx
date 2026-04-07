import { AlertTriangle, CheckCircle2, CloudUpload, Wifi, WifiOff } from 'lucide-react';

type OfflineSyncStatusPillProps = {
  isOnline: boolean;
  pendingCount: number;
  failedCount: number;
  compact?: boolean;
};

export default function OfflineSyncStatusPill({
  isOnline,
  pendingCount,
  failedCount,
  compact = false,
}: OfflineSyncStatusPillProps) {
  const showFailed = failedCount > 0;
  const hasPending = pendingCount > 0;

  const containerClass = compact
    ? 'inline-flex h-6 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-slate-700'
    : 'inline-flex h-7 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700';

  return (
    <div className={containerClass}>
      <span
        className={`inline-flex items-center gap-1 whitespace-nowrap ${
          isOnline ? 'text-emerald-700' : 'text-amber-700'
        }`}
      >
        {isOnline ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
        {isOnline ? 'Online' : 'Offline'}
      </span>

      <span className="h-3.5 w-px bg-slate-200" />

      {showFailed ? (
        compact ? (
          <span className="inline-flex items-center gap-1 whitespace-nowrap text-red-700">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span className="inline-flex h-4 min-w-[18px] items-center justify-center rounded-full bg-red-100 px-1 text-[10px] font-bold leading-none text-red-700">
              {failedCount}
            </span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 whitespace-nowrap text-red-700">
            <AlertTriangle className="h-3.5 w-3.5" />
            Failed: {failedCount}
          </span>
        )
      ) : hasPending ? (
        compact ? (
          <span className="inline-flex items-center gap-1 whitespace-nowrap text-slate-700">
            <CloudUpload className="h-3.5 w-3.5 shrink-0" />
            <span className="inline-flex h-4 min-w-[18px] items-center justify-center rounded-full bg-slate-100 px-1 text-[10px] font-bold leading-none text-slate-700">
              {pendingCount}
            </span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 whitespace-nowrap text-slate-700">
            <CloudUpload className="h-3.5 w-3.5" />
            Pending: {pendingCount}
          </span>
        )
      ) : (
        <span className="inline-flex items-center gap-1 whitespace-nowrap text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Synced
        </span>
      )}
    </div>
  );
}
