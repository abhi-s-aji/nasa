import React from 'react';
import { X, Play, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { ResourceDeltas, SimulationState } from '../../types/simulation';

interface DayAdvanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: number;
  deltas: ResourceDeltas;
  events: string[];
  state: SimulationState;
}

export const DayAdvanceModal: React.FC<DayAdvanceModalProps> = ({
  isOpen,
  onClose,
  day,
  deltas,
  events,
  state,
}) => {
  if (!isOpen) return null;

  const metrics = [
    { label: 'Oxygen', delta: deltas.oxygen, current: state.resources.oxygen },
    { label: 'Water', delta: deltas.water, current: state.resources.water },
    { label: 'Food', delta: deltas.food, current: state.resources.food },
    { label: 'Energy', delta: deltas.energy, current: state.resources.energy },
    { label: 'Shielding', delta: deltas.radiationShielding, current: state.resources.radiationShielding },
    { label: 'Crew Health', delta: deltas.crewHealth, current: state.resources.crewHealth },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#0f172a] border border-slate-700 w-full max-w-lg rounded shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 border-b border-slate-800 pb-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Daily Telemetry Report
            </div>
            <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2 mt-0.5">
              <span>SOL {String(day).padStart(2, '0')} COMPLETED</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="text-cyan-400">SOL {String(Math.min(30, day + 1)).padStart(2, '0')}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Incidents or events on this day */}
        {events.length > 0 && (
          <div className="mb-4 p-3 rounded bg-amber-950/40 border border-amber-800/60 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              SURFACE INCIDENTS DETECTED:
            </div>
            <ul className="text-slate-200 list-disc list-inside space-y-1 font-sans">
              {events.map((evt, idx) => (
                <li key={idx}>{evt}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 6 Metric Deltas */}
        <div className="mb-6">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
            24-Hour Resource Differential:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {metrics.map((m) => {
              const isPositive = m.delta > 0;
              const isNegative = m.delta < 0;

              return (
                <div
                  key={m.label}
                  className="bg-slate-900/90 border border-slate-800 p-2.5 rounded font-mono text-xs"
                >
                  <div className="text-[10px] text-slate-400 uppercase">{m.label}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-bold text-slate-200">
                      {m.current.toFixed(0)}%
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        isPositive
                          ? 'text-emerald-400'
                          : isNegative
                          ? 'text-rose-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {isPositive ? `+${m.delta.toFixed(1)}%` : `${m.delta.toFixed(1)}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Commander Debriefing note */}
        <div className="text-xs text-slate-400 font-mono mb-6 bg-slate-950 p-3 rounded border border-slate-800/80">
          Status: <span className="text-slate-200 font-semibold">{state.overallStatus.toUpperCase()}</span>. Review resource allocations before executing the next solar cycle.
        </div>

        {/* Dismiss Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-mono font-bold tracking-wider uppercase rounded bg-cyan-600 hover:bg-cyan-500 text-white transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Proceed to Sol {String(Math.min(30, day + 1)).padStart(2, '0')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
