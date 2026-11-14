import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number;
  unit?: string;
  delta?: number;
  deltaLabel?: string;
  icon: LucideIcon;
  subtext?: string;
  thresholds?: {
    warning: number;
    critical: number;
  };
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit = '%',
  delta,
  deltaLabel = 'vs prev day',
  icon: Icon,
  subtext,
  thresholds = { warning: 30, critical: 15 },
  onClick,
}) => {
  const isCritical = value <= thresholds.critical;
  const isWarning = !isCritical && value <= thresholds.warning;

  // Status-based color tokens
  const statusColor = isCritical
    ? 'text-rose-400 border-rose-900/60 bg-rose-950/20'
    : isWarning
    ? 'text-amber-400 border-amber-900/60 bg-amber-950/20'
    : 'text-slate-100 border-slate-800 bg-[#0f172a]/90';

  const barColor = isCritical
    ? 'bg-rose-500'
    : isWarning
    ? 'bg-amber-400'
    : 'bg-cyan-500';

  return (
    <div
      onClick={onClick}
      className={`border rounded p-4 transition-colors ${statusColor} ${
        onClick ? 'cursor-pointer hover:border-slate-700' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5 font-mono">
          <Icon className="w-4 h-4 text-slate-400" />
          {label}
        </span>
        {delta !== undefined && (
          <span
            className={`text-xs font-mono font-medium ${
              delta > 0
                ? 'text-emerald-400'
                : delta < 0
                ? 'text-rose-400'
                : 'text-slate-400'
            }`}
            title={deltaLabel}
          >
            {delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)}
            {unit}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold font-mono tracking-tight text-white">
          {value.toFixed(0)}
        </span>
        <span className="text-xs font-mono text-slate-400">{unit}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full transition-all duration-300 ${barColor}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>

      {subtext && (
        <div className="text-[11px] text-slate-400 truncate font-mono">
          {subtext}
        </div>
      )}
    </div>
  );
};
