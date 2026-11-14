import React from 'react';
import { SystemStatus } from '../../types/simulation';

interface StatusBadgeProps {
  status: SystemStatus;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'md' }) => {
  const config = {
    nominal: {
      text: label || 'NOMINAL',
      dotClass: 'bg-emerald-400',
      bgClass: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60',
    },
    warning: {
      text: label || 'WARNING',
      dotClass: 'bg-amber-400',
      bgClass: 'bg-amber-950/40 text-amber-300 border-amber-800/60',
    },
    critical: {
      text: label || 'CRITICAL',
      dotClass: 'bg-rose-500',
      bgClass: 'bg-rose-950/50 text-rose-300 border-rose-800/60 animate-pulse',
    },
    offline: {
      text: label || 'OFFLINE',
      dotClass: 'bg-slate-500',
      bgClass: 'bg-slate-900 text-slate-400 border-slate-700',
    },
  }[status];

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold border ${config.bgClass} ${sizeClass} rounded`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      {config.text}
    </span>
  );
};
