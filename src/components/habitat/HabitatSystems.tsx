import React from 'react';
import {
  Cpu,
  Power,
  Zap,
  Activity,
  Wind,
  Droplets,
  Sun,
  Sprout,
  Shield,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { SimulationState, HabitatSystem } from '../../types/simulation';
import { StatusBadge } from '../common/StatusBadge';

interface HabitatSystemsProps {
  state: SimulationState;
  onToggleWaterRecycling: () => void;
  onToggleSolarOptimization: () => void;
  onDeployAuxShielding: () => void;
  onToggleGreenhouse: () => void;
  onTogglePowerSaving: () => void;
}

export const HabitatSystems: React.FC<HabitatSystemsProps> = ({
  state,
  onToggleWaterRecycling,
  onToggleSolarOptimization,
  onDeployAuxShielding,
  onToggleGreenhouse,
  onTogglePowerSaving,
}) => {
  const { systems, status, resources } = state;
  const isFinished = status !== 'in-progress';

  // System icons mapping
  const systemIconMap: Record<string, React.ElementType> = {
    eclss: Wind,
    'water-recycling': Droplets,
    'solar-grid': Sun,
    greenhouse: Sprout,
    'radiation-shield': Shield,
  };

  const totalPowerDraw = systems
    .filter((s) => s.operational)
    .reduce((acc, s) => acc + s.powerDrawKw, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0b1329] border border-slate-800 rounded p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold mb-1">
            Habitat Engineering & Telemetry
          </div>
          <h1 className="text-xl font-bold font-mono text-white tracking-tight">
            Habitat Core Subsystems
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage operational states, power allocations, and mechanical efficiencies across the 5 primary lunar habitat systems.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900 px-4 py-2 rounded border border-slate-800 font-mono text-xs">
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Total Active Load</div>
            <div className="text-amber-400 font-bold">{totalPowerDraw.toFixed(1)} kW</div>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Grid Reserve</div>
            <div className="text-cyan-400 font-bold">{resources.energy.toFixed(0)}%</div>
          </div>
        </div>
      </div>

      {/* 5 Habitat System Cards */}
      <div className="space-y-4">
        {systems.map((system) => {
          const IconComponent = systemIconMap[system.id] || Cpu;

          // Determine button action based on system ID
          let actionButton: React.ReactNode = null;

          if (system.id === 'water-recycling') {
            actionButton = (
              <button
                onClick={onToggleWaterRecycling}
                disabled={isFinished}
                className={`px-4 py-2 text-xs font-mono font-medium rounded transition-colors ${
                  state.waterRecyclingActive
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                }`}
              >
                {state.waterRecyclingActive ? 'RECYCLER: ONLINE' : 'RECYCLER: OFFLINE'}
              </button>
            );
          } else if (system.id === 'solar-grid') {
            actionButton = (
              <button
                onClick={onToggleSolarOptimization}
                disabled={isFinished}
                className={`px-4 py-2 text-xs font-mono font-medium rounded transition-colors ${
                  state.solarTrackingOptimized
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                }`}
              >
                {state.solarTrackingOptimized ? 'TRACKING: OPTIMIZED' : 'OPTIMIZE SOLAR SERVO (-3% pwr)'}
              </button>
            );
          } else if (system.id === 'greenhouse') {
            actionButton = (
              <button
                onClick={onToggleGreenhouse}
                disabled={isFinished}
                className={`px-4 py-2 text-xs font-mono font-medium rounded transition-colors ${
                  state.greenhouseActive
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                }`}
              >
                {state.greenhouseActive ? 'AEROPONICS: ACTIVE' : 'START GREENHOUSE'}
              </button>
            );
          } else if (system.id === 'radiation-shield') {
            actionButton = (
              <button
                onClick={onDeployAuxShielding}
                disabled={isFinished || resources.energy < 5}
                className="px-4 py-2 text-xs font-mono font-medium rounded bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700 transition-colors disabled:opacity-50"
              >
                REINFORCE BERM (+12% / 5% pwr)
              </button>
            );
          } else if (system.id === 'eclss') {
            actionButton = (
              <button
                onClick={onTogglePowerSaving}
                disabled={isFinished}
                className={`px-4 py-2 text-xs font-mono font-medium rounded transition-colors ${
                  state.emergencyPowerSaving
                    ? 'bg-amber-950 text-amber-300 border border-amber-700 hover:bg-amber-900'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                }`}
              >
                {state.emergencyPowerSaving ? 'POWER-SAVING ENGAGED' : 'ENGAGE POWER SAVING (-45% draw)'}
              </button>
            );
          }

          return (
            <div
              key={system.id}
              className="bg-[#0b1329] border border-slate-800 rounded p-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold font-mono text-white">
                        {system.name}
                      </h3>
                      <StatusBadge status={system.status} />
                    </div>
                    <div className="text-xs font-mono text-slate-400 mt-0.5">
                      Subsystem: <span className="text-slate-300">{system.subsystem}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {actionButton}
                </div>
              </div>

              <p className="text-xs text-slate-300 mb-4 leading-relaxed font-sans">
                {system.description}
              </p>

              {/* System Specs and Telemetry Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950 p-3 rounded border border-slate-800/80 font-mono text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Operational Status</div>
                  <div className="text-slate-200 font-semibold mt-0.5">
                    {system.operational ? 'Online / Nominal' : 'Standby / Dormant'}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 uppercase">System Efficiency</div>
                  <div className="text-cyan-400 font-semibold mt-0.5">
                    {system.efficiency}% Rating
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Continuous Power Draw</div>
                  <div className="text-amber-400 font-semibold mt-0.5">
                    {system.operational ? `${system.powerDrawKw} kW` : '0.0 kW (Off)'}
                  </div>
                </div>
              </div>

              {/* Resource Impact description */}
              <div className="mt-3 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <span className="text-cyan-400 font-semibold">IMPACT PROFILE:</span>
                <span>{system.impactDescription}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
