import React, { useState } from 'react';
import {
  Wind,
  Droplets,
  Apple,
  Zap,
  Shield,
  HeartPulse,
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MissionTab, SimulationState } from '../../types/simulation';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';

interface MissionOverviewProps {
  state: SimulationState;
  onAdvanceDay: () => void;
  onSelectTab: (tab: MissionTab) => void;
  onToggleWaterRecycling: () => void;
  onToggleSolarOptimization: () => void;
  onDeployAuxShielding: () => void;
  onToggleGreenhouse: () => void;
  onTogglePowerSaving: () => void;
  onPerformMedical: () => void;
  onReset: () => void;
}

export const MissionOverview: React.FC<MissionOverviewProps> = ({
  state,
  onAdvanceDay,
  onSelectTab,
  onToggleWaterRecycling,
  onToggleSolarOptimization,
  onDeployAuxShielding,
  onToggleGreenhouse,
  onTogglePowerSaving,
  onPerformMedical,
  onReset,
}) => {
  const [selectedChartMetric, setSelectedChartMetric] = useState<
    'all' | 'vital' | 'power'
  >('vital');

  const { resources, history, missionDay, maxDays, status, failureReason } = state;
  const isFinished = status !== 'in-progress';

  // Calculate previous day deltas
  const currentHistory = history[history.length - 1];
  const prevHistory = history.length > 1 ? history[history.length - 2] : null;

  const deltas = prevHistory
    ? {
        oxygen: currentHistory.oxygen - prevHistory.oxygen,
        water: currentHistory.water - prevHistory.water,
        food: currentHistory.food - prevHistory.food,
        energy: currentHistory.energy - prevHistory.energy,
        radiationShielding: currentHistory.radiationShielding - prevHistory.radiationShielding,
        crewHealth: currentHistory.crewHealth - prevHistory.crewHealth,
      }
    : undefined;

  // Active warnings
  const warnings: string[] = [];
  if (resources.oxygen < 25) warnings.push('CRITICAL: Oxygen reserves below 25% threshold.');
  if (resources.water < 25) warnings.push('CRITICAL: Potable water below 25% reserve limit.');
  if (resources.energy < 20) warnings.push('CRITICAL: Energy battery banks below 20%.');
  if (resources.radiationShielding < 35) warnings.push('WARNING: Regolith radiation shielding compromised.');
  if (resources.crewHealth < 40) warnings.push('CRITICAL: Crew health requires immediate medical triage.');

  return (
    <div className="space-y-6">
      {/* Mission Banner & Critical Alert Banner if necessary */}
      {isFinished ? (
        <div
          className={`p-5 rounded border ${
            status === 'succeeded'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/40 border-rose-800 text-rose-200'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="p-2 rounded bg-slate-900 border border-slate-700">
              {status === 'succeeded' ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-rose-400" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold font-mono tracking-wide uppercase">
                {status === 'succeeded'
                  ? 'Mission Accomplished — 30 Lunar Days Survived!'
                  : 'Mission Aborted — Outpost Failure'}
              </h2>
              <p className="text-sm mt-1 text-slate-300 font-sans">
                {status === 'succeeded'
                  ? 'Congratulations, Commander. You maintained habitat equilibrium and kept all 4 astronauts alive through 30 grueling lunar days at the South Pole.'
                  : failureReason || 'A critical life support resource was depleted, forcing emergency evacuation.'}
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={onReset}
                  className="px-4 py-2 text-xs font-mono font-medium rounded bg-cyan-700 hover:bg-cyan-600 text-white flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restart New Mission Simulation
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : warnings.length > 0 ? (
        <div className="p-4 rounded border bg-rose-950/30 border-rose-900/60 text-rose-300">
          <div className="flex items-center gap-2 font-mono font-bold text-xs uppercase tracking-wider mb-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            TELEMETRY ALARMS ACTIVE ({warnings.length})
          </div>
          <ul className="text-xs space-y-1 font-mono text-slate-300 list-disc list-inside">
            {warnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Top Header Card: Mission Details & Quick Advance Action */}
      <div className="bg-[#0b1329] border border-slate-800 rounded p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold">
                ACTIVE DEPLOYMENT
              </span>
              <StatusBadge status={state.overallStatus} />
            </div>
            <h1 className="text-2xl font-bold font-mono text-white tracking-tight">
              Artemis Research Outpost
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-mono">
              <div>
                Location: <span className="text-slate-200">Lunar South Pole (Shackleton Rim)</span>
              </div>
              <div>•</div>
              <div>
                Duration: <span className="text-slate-200">30 Lunar Days</span>
              </div>
              <div>•</div>
              <div>
                Crew: <span className="text-slate-200">4 Astronauts</span>
              </div>
              <div>•</div>
              <div>
                Solar Cycle: <span className="text-slate-200">Day {missionDay} of {maxDays}</span>
              </div>
            </div>
          </div>

          {/* Primary Action Button: Advance One Day */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] font-mono uppercase text-slate-400">
                Current Command Sol
              </div>
              <div className="text-lg font-mono font-bold text-cyan-400">
                SOL {String(missionDay).padStart(2, '0')}
              </div>
            </div>

            <button
              onClick={onAdvanceDay}
              disabled={isFinished}
              className={`px-6 py-3.5 rounded font-mono font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-3 shadow-lg ${
                isFinished
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white border border-cyan-400/40 hover:shadow-cyan-900/30'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Advance One Day</span>
            </button>
          </div>
        </div>
      </div>

      {/* Six Main Resource Metric Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Telemetry & Resource Summary
          </h2>
          <button
            onClick={() => onSelectTab('resources')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            Detailed Subsystems <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard
            label="Oxygen"
            value={resources.oxygen}
            delta={deltas?.oxygen}
            icon={Wind}
            subtext="ECLSS Atmospheric Mix"
            thresholds={{ warning: 30, critical: 15 }}
            onClick={() => onSelectTab('resources')}
          />
          <MetricCard
            label="Water"
            value={resources.water}
            delta={deltas?.water}
            icon={Droplets}
            subtext={state.waterRecyclingActive ? 'Recycling Loop: 85%' : 'Recycling Loop: Offline'}
            thresholds={{ warning: 28, critical: 15 }}
            onClick={() => onSelectTab('resources')}
          />
          <MetricCard
            label="Food"
            value={resources.food}
            delta={deltas?.food}
            icon={Apple}
            subtext={state.greenhouseActive ? 'Greenhouse: Producing' : 'Rations Depleting'}
            thresholds={{ warning: 25, critical: 15 }}
            onClick={() => onSelectTab('resources')}
          />
          <MetricCard
            label="Energy"
            value={resources.energy}
            delta={deltas?.energy}
            icon={Zap}
            subtext={state.emergencyPowerSaving ? 'Power Save: Active' : 'Solar Towers Nominal'}
            thresholds={{ warning: 22, critical: 10 }}
            onClick={() => onSelectTab('resources')}
          />
          <MetricCard
            label="Shielding"
            value={resources.radiationShielding}
            delta={deltas?.radiationShielding}
            icon={Shield}
            subtext="Sintered Regolith Berm"
            thresholds={{ warning: 35, critical: 20 }}
            onClick={() => onSelectTab('resources')}
          />
          <MetricCard
            label="Crew Health"
            value={resources.crewHealth}
            delta={deltas?.crewHealth}
            icon={HeartPulse}
            subtext={`${state.crew.filter((c) => c.status === 'Nominal').length} / 4 Nominal`}
            thresholds={{ warning: 50, critical: 25 }}
            onClick={() => onSelectTab('crew')}
          />
        </div>
      </div>

      {/* Two Column Layout: Interactive Commander Actions & Historical Telemetry Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Tactical Actions before advancing */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0b1329] border border-slate-800 rounded p-4">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                Commander Directives
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Pre-Step Actions
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Configure outpost subsystems and allocate crew labor before initiating the next solar day cycle.
            </p>

            <div className="space-y-2.5">
              {/* Action 1: Water Recycling */}
              <div className="p-3 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5 max-w-[70%]">
                  <div className="text-xs font-mono font-medium text-slate-200">
                    Water Recovery Unit
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Reclaims 75% hygiene/potable water. (Draws 2.8 kW power)
                  </div>
                </div>
                <button
                  onClick={onToggleWaterRecycling}
                  disabled={isFinished}
                  className={`px-3 py-1.5 text-xs font-mono font-medium rounded transition-colors ${
                    state.waterRecyclingActive
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                  }`}
                >
                  {state.waterRecyclingActive ? 'ACTIVE' : 'OFFLINE'}
                </button>
              </div>

              {/* Action 2: Solar Tracking Optimization */}
              <div className="p-3 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5 max-w-[70%]">
                  <div className="text-xs font-mono font-medium text-slate-200">
                    Optimize Solar Alignment
                  </div>
                  <div className="text-[11px] text-slate-400">
                    +35% daily solar harvest. (Costs 3% power servo calibration)
                  </div>
                </div>
                <button
                  onClick={onToggleSolarOptimization}
                  disabled={isFinished}
                  className={`px-3 py-1.5 text-xs font-mono font-medium rounded transition-colors ${
                    state.solarTrackingOptimized
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                  }`}
                >
                  {state.solarTrackingOptimized ? 'OPTIMIZED' : 'STANDARD'}
                </button>
              </div>

              {/* Action 3: Auxiliary Regolith Shielding */}
              <div className="p-3 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5 max-w-[70%]">
                  <div className="text-xs font-mono font-medium text-slate-200">
                    Reinforce Regolith Berm
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Instantly +12% shielding integrity. (Costs 5% power)
                  </div>
                </div>
                <button
                  onClick={onDeployAuxShielding}
                  disabled={isFinished || state.resources.energy < 5}
                  className="px-3 py-1.5 text-xs font-mono font-medium rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 transition-colors disabled:opacity-50"
                >
                  REINFORCE
                </button>
              </div>

              {/* Action 4: Greenhouse Food Production */}
              <div className="p-3 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5 max-w-[70%]">
                  <div className="text-xs font-mono font-medium text-slate-200">
                    Hydroponic Greenhouse
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Yields fresh rations (+2.0%/day). (Uses 1.8% H2O, 2.5% power)
                  </div>
                </div>
                <button
                  onClick={onToggleGreenhouse}
                  disabled={isFinished}
                  className={`px-3 py-1.5 text-xs font-mono font-medium rounded transition-colors ${
                    state.greenhouseActive
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                  }`}
                >
                  {state.greenhouseActive ? 'GROWING' : 'DORMANT'}
                </button>
              </div>

              {/* Action 5: Emergency Power-Saving Mode */}
              <div className="p-3 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5 max-w-[70%]">
                  <div className="text-xs font-mono font-medium text-slate-200">
                    Emergency Power-Saving
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Slashes base habitat power consumption by 45%.
                  </div>
                </div>
                <button
                  onClick={onTogglePowerSaving}
                  disabled={isFinished}
                  className={`px-3 py-1.5 text-xs font-mono font-medium rounded transition-colors ${
                    state.emergencyPowerSaving
                      ? 'bg-amber-950 text-amber-300 border border-amber-700 hover:bg-amber-900'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                  }`}
                >
                  {state.emergencyPowerSaving ? 'ENGAGED' : 'NORMAL'}
                </button>
              </div>

              {/* Action 6: Medical Bay Treatment */}
              <div className="p-3 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5 max-w-[70%]">
                  <div className="text-xs font-mono font-medium text-slate-200">
                    Medical Bay Therapy
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Restores crew health by +8%. (Costs 3% power, 2% water)
                  </div>
                </div>
                <button
                  onClick={onPerformMedical}
                  disabled={
                    isFinished ||
                    state.resources.energy < 3 ||
                    state.resources.water < 2
                  }
                  className="px-3 py-1.5 text-xs font-mono font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-50"
                >
                  TREAT CREW
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Historical Trend Chart */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0b1329] border border-slate-800 rounded p-4 h-full flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-slate-800/80 pb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  Multi-Sol Telemetry History
                </span>

                <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800">
                  <button
                    onClick={() => setSelectedChartMetric('vital')}
                    className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${
                      selectedChartMetric === 'vital'
                        ? 'bg-slate-800 text-cyan-300'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Vitals (O2/H2O/Food)
                  </button>
                  <button
                    onClick={() => setSelectedChartMetric('power')}
                    className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${
                      selectedChartMetric === 'power'
                        ? 'bg-slate-800 text-cyan-300'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Power & Defense
                  </button>
                  <button
                    onClick={() => setSelectedChartMetric('all')}
                    className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${
                      selectedChartMetric === 'all'
                        ? 'bg-slate-800 text-cyan-300'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All Metrics
                  </button>
                </div>
              </div>

              {/* Chart container */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={history}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="day"
                      stroke="#64748b"
                      tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
                      tickFormatter={(val) => `Day ${val}`}
                    />
                    <YAxis
                      domain={[0, 100]}
                      stroke="#64748b"
                      tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        paddingTop: '8px',
                        fontFamily: 'monospace',
                        fontSize: '11px',
                      }}
                    />

                    {(selectedChartMetric === 'vital' || selectedChartMetric === 'all') && (
                      <>
                        <Line
                          type="monotone"
                          dataKey="oxygen"
                          name="Oxygen %"
                          stroke="#38bdf8"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="water"
                          name="Water %"
                          stroke="#60a5fa"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="food"
                          name="Food %"
                          stroke="#34d399"
                          strokeWidth={2}
                          dot={false}
                        />
                      </>
                    )}

                    {(selectedChartMetric === 'power' || selectedChartMetric === 'all') && (
                      <>
                        <Line
                          type="monotone"
                          dataKey="energy"
                          name="Energy %"
                          stroke="#fbbf24"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="radiationShielding"
                          name="Shielding %"
                          stroke="#a78bfa"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="crewHealth"
                          name="Crew Health %"
                          stroke="#f87171"
                          strokeWidth={2}
                          dot={false}
                        />
                      </>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick telemetry footer */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Telemetry Feed: SYNCED (Lunar Relay Orbit 2)</span>
              <span>Mission Target: 30 Sols</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
