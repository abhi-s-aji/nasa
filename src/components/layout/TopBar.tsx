import React from 'react';
import { Compass, RotateCcw, Menu, ShieldAlert } from 'lucide-react';
import { SimulationState } from '../../types/simulation';
import { StatusBadge } from '../common/StatusBadge';

interface TopBarProps {
  state: SimulationState;
  onResetClick: () => void;
  onMobileMenuToggle: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  state,
  onResetClick,
  onMobileMenuToggle,
}) => {
  const isFinished = state.status !== 'in-progress';

  return (
    <header className="h-16 bg-[#0b1329] border-b border-slate-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Branding & Mission identifier */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden text-slate-400 hover:text-white p-1.5 rounded hover:bg-slate-800"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-slate-900 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold tracking-wider text-base text-white">
                OUTPOST
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                v2026.1
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 hidden sm:block truncate max-w-xs">
              Artemis Research Outpost • Lunar South Pole
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Mission Day indicator & Progress bar */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Mission Timeline
          </div>
          <div className="text-sm font-mono font-bold text-white flex items-center gap-1.5">
            <span>DAY {String(state.missionDay).padStart(2, '0')}</span>
            <span className="text-slate-500 font-normal">/</span>
            <span className="text-slate-400 font-normal">{state.maxDays}</span>
          </div>
        </div>

        <div className="hidden lg:block w-32 bg-slate-900 border border-slate-800 h-2 rounded overflow-hidden">
          <div
            className="bg-cyan-500 h-full transition-all duration-300"
            style={{ width: `${(state.missionDay / state.maxDays) * 100}%` }}
          />
        </div>
      </div>

      {/* Right: System Status & Action buttons */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono hidden md:inline">SYSTEM STATUS:</span>
          <StatusBadge status={state.overallStatus} />
        </div>

        {isFinished && (
          <span className={`text-xs font-mono px-2 py-1 rounded font-bold uppercase border ${
            state.status === 'succeeded'
              ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
              : 'bg-rose-950 text-rose-300 border-rose-700'
          }`}>
            {state.status === 'succeeded' ? 'MISSION SUCCESS' : 'MISSION FAILED'}
          </span>
        )}

        <button
          onClick={onResetClick}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded transition-colors"
          title="Restart Mission Simulator"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </header>
  );
};
