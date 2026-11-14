import React from 'react';
import {
  Wind,
  Droplets,
  Apple,
  Zap,
  Shield,
  HeartPulse,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Sun,
  ShieldAlert,
} from 'lucide-react';
import { SimulationState } from '../../types/simulation';
import { StatusBadge } from '../common/StatusBadge';

interface ResourceManagementProps {
  state: SimulationState;
  onToggleWaterRecycling: () => void;
  onToggleSolarOptimization: () => void;
  onDeployAuxShielding: () => void;
  onToggleGreenhouse: () => void;
  onTogglePowerSaving: () => void;
  onPerformMedical: () => void;
}

export const ResourceManagement: React.FC<ResourceManagementProps> = ({
  state,
  onToggleWaterRecycling,
  onToggleSolarOptimization,
  onDeployAuxShielding,
  onToggleGreenhouse,
  onTogglePowerSaving,
  onPerformMedical,
}) => {
  const { resources, status } = state;
  const isFinished = status !== 'in-progress';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0b1329] border border-slate-800 rounded p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold mb-1">
            Life Support & Outpost Subsystems
          </div>
          <h1 className="text-xl font-bold font-mono text-white tracking-tight">
            Resource Management & Closed-Loop Controls
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor atmospheric scrubbers, water reclamation loops, solar power distribution, and radiation shield attenuation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={state.overallStatus} />
        </div>
      </div>

      {/* Main Grid: 6 Resource Subsystem Deep-Dive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Oxygen / ECLSS */}
        <div className="bg-[#0b1329] border border-slate-800 rounded p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
              <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
                <Wind className="w-4 h-4 text-cyan-400" />
                ATMOSPHERIC OXYGEN (O₂)
              </span>
              <span className="text-sm font-mono font-bold text-cyan-400">
                {resources.oxygen.toFixed(1)}%
              </span>
            </div>

            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-300 ${
                  resources.oxygen < 25
                    ? 'bg-rose-500'
                    : resources.oxygen < 45
                    ? 'bg-amber-400'
                    : 'bg-cyan-400'
                }`}
                style={{ width: `${resources.oxygen}%` }}
              />
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-400 mb-4">
              <div className="flex justify-between">
                <span>Baseline Crew Consumption:</span>
                <span className="text-slate-200">-3.5% / day</span>
              </div>
              <div className="flex justify-between">
                <span>Greenhouse Algae Scrubbing:</span>
                <span className="text-emerald-400">
                  {state.greenhouseActive ? '+1.4% / day' : '0.0% (Standby)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Partial Pressure ppO₂:</span>
                <span className="text-slate-200">
                  {((resources.oxygen / 100) * 21.3).toFixed(1)} kPa
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Cabin Pressure:</span>
                <span className="text-slate-200">101.3 kPa (Nominal)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-2">
              Subsystem: Sabatier Reactor & Electrolysis Cell
            </div>
            <button
              onClick={onToggleGreenhouse}
              disabled={isFinished}
              className={`w-full py-2 text-xs font-mono font-medium rounded border transition-colors ${
                state.greenhouseActive
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              {state.greenhouseActive ? 'Greenhouse O2 Scrubbing: ACTIVE' : 'Activate Greenhouse Scrubbing'}
            </button>
          </div>
        </div>

        {/* 2. Potable Water & Hydrological Recovery */}
        <div className="bg-[#0b1329] border border-slate-800 rounded p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
              <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                POTABLE WATER (H₂O)
              </span>
              <span className="text-sm font-mono font-bold text-blue-400">
                {resources.water.toFixed(1)}%
              </span>
            </div>

            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-300 ${
                  resources.water < 25
                    ? 'bg-rose-500'
                    : resources.water < 45
                    ? 'bg-amber-400'
                    : 'bg-blue-400'
                }`}
                style={{ width: `${resources.water}%` }}
              />
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-400 mb-4">
              <div className="flex justify-between">
                <span>Direct Usage (4 crew):</span>
                <span className="text-slate-200">-4.8% / day</span>
              </div>
              <div className="flex justify-between">
                <span>Vapor Compression Loop:</span>
                <span className={state.waterRecyclingActive ? 'text-emerald-400' : 'text-slate-500'}>
                  {state.waterRecyclingActive ? '+3.6% reclaimed' : 'Loop Offline'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Greenhouse Hydroponics:</span>
                <span className={state.greenhouseActive ? 'text-amber-400' : 'text-slate-500'}>
                  {state.greenhouseActive ? '-1.8% / day' : '0.0%'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Net Daily Water Delta:</span>
                <span className="text-slate-200">
                  {state.waterRecyclingActive ? (state.greenhouseActive ? '-3.0%' : '-1.2%') : '-4.8%'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-2">
              Subsystem: Distillation & Catalytic Oxidation
            </div>
            <button
              onClick={onToggleWaterRecycling}
              disabled={isFinished}
              className={`w-full py-2 text-xs font-mono font-medium rounded border transition-colors ${
                state.waterRecyclingActive
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              {state.waterRecyclingActive ? 'Recycling Loop: ACTIVE (2.8 kW)' : 'Activate Water Recycling'}
            </button>
          </div>
        </div>

        {/* 3. Food & Biomass Stores */}
        <div className="bg-[#0b1329] border border-slate-800 rounded p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
              <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
                <Apple className="w-4 h-4 text-emerald-400" />
                FOOD & BIOMASS
              </span>
              <span className="text-sm font-mono font-bold text-emerald-400">
                {resources.food.toFixed(1)}%
              </span>
            </div>

            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-300 ${
                  resources.food < 25
                    ? 'bg-rose-500'
                    : resources.food < 45
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${resources.food}%` }}
              />
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-400 mb-4">
              <div className="flex justify-between">
                <span>Crew Caloric Intake:</span>
                <span className="text-slate-200">-3.2% / day (11,200 kcal total)</span>
              </div>
              <div className="flex justify-between">
                <span>Hydroponic Production:</span>
                <span className={state.greenhouseActive ? 'text-emerald-400' : 'text-slate-500'}>
                  {state.greenhouseActive ? '+2.0% fresh yield' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Rations Sols:</span>
                <span className="text-slate-200">
                  {Math.floor(resources.food / (state.greenhouseActive ? 1.2 : 3.2))} Sols
                </span>
              </div>
              <div className="flex justify-between">
                <span>Microgreen Growth Cycle:</span>
                <span className="text-slate-200">7-day continuous aeroponics</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-2">
              Subsystem: Automated Crop Lighting & Nutrient Injector
            </div>
            <button
              onClick={onToggleGreenhouse}
              disabled={isFinished}
              className={`w-full py-2 text-xs font-mono font-medium rounded border transition-colors ${
                state.greenhouseActive
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              {state.greenhouseActive ? 'Greenhouse: HARVESTING (+2.0%)' : 'Start Greenhouse Production'}
            </button>
          </div>
        </div>

        {/* 4. Electrical Grid & Energy Storage */}
        <div className="bg-[#0b1329] border border-slate-800 rounded p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
              <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                POWER GRID & BATTERIES
              </span>
              <span className="text-sm font-mono font-bold text-amber-400">
                {resources.energy.toFixed(1)}%
              </span>
            </div>

            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-300 ${
                  resources.energy < 20
                    ? 'bg-rose-500'
                    : resources.energy < 40
                    ? 'bg-amber-400'
                    : 'bg-amber-400'
                }`}
                style={{ width: `${resources.energy}%` }}
              />
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-400 mb-4">
              <div className="flex justify-between">
                <span>Solar Tower Generation:</span>
                <span className={state.solarTrackingOptimized ? 'text-emerald-400' : 'text-slate-200'}>
                  {state.solarTrackingOptimized ? '~13.5% / day (Optimized)' : '~9.8% / day (Fixed)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Base Life Support Draw:</span>
                <span className={state.emergencyPowerSaving ? 'text-emerald-400' : 'text-slate-200'}>
                  {state.emergencyPowerSaving ? '-4.95% (45% saved)' : '-9.0% / day'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Subsystem Additions:</span>
                <span className="text-slate-200">
                  {(state.waterRecyclingActive ? 2.8 : 0) +
                    (state.greenhouseActive ? 2.5 : 0) +
                    (state.auxShieldingDeployed ? 1.8 : 0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Regenerative Fuel Cells:</span>
                <span className="text-slate-200">Operational Backup</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <button
              onClick={onToggleSolarOptimization}
              disabled={isFinished}
              className={`w-full py-2 text-xs font-mono font-medium rounded border transition-colors ${
                state.solarTrackingOptimized
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              {state.solarTrackingOptimized ? 'Solar Tracking: OPTIMIZED' : 'Improve Solar Generation (-3% pwr)'}
            </button>
            <button
              onClick={onTogglePowerSaving}
              disabled={isFinished}
              className={`w-full py-2 text-xs font-mono font-medium rounded border transition-colors ${
                state.emergencyPowerSaving
                  ? 'bg-amber-950 text-amber-300 border-amber-700 hover:bg-amber-900'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              {state.emergencyPowerSaving ? 'Power-Saving: ENGAGED (-45% draw)' : 'Emergency Power-Saving Mode'}
            </button>
          </div>
        </div>

        {/* 5. Regolith Radiation Shielding */}
        <div className="bg-[#0b1329] border border-slate-800 rounded p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
              <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                RADIATION SHIELDING
              </span>
              <span className="text-sm font-mono font-bold text-purple-400">
                {resources.radiationShielding.toFixed(1)}%
              </span>
            </div>

            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-300 ${
                  resources.radiationShielding < 35
                    ? 'bg-rose-500'
                    : resources.radiationShielding < 60
                    ? 'bg-amber-400'
                    : 'bg-purple-400'
                }`}
                style={{ width: `${resources.radiationShielding}%` }}
              />
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-400 mb-4">
              <div className="flex justify-between">
                <span>Galactic Cosmic Ray (GCR) Flux:</span>
                <span className="text-slate-200">1.8 mSv / day ambient</span>
              </div>
              <div className="flex justify-between">
                <span>Regolith Overburden Depth:</span>
                <span className="text-slate-200">
                  {((resources.radiationShielding / 100) * 3.5).toFixed(1)} meters
                </span>
              </div>
              <div className="flex justify-between">
                <span>Solar Proton Event (SPE) Risk:</span>
                <span className={resources.radiationShielding >= 75 ? 'text-emerald-400' : 'text-rose-400'}>
                  {resources.radiationShielding >= 75 ? 'Shielded (>75%)' : 'ELEVATED RISK'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Active Deflector Coil:</span>
                <span className={state.auxShieldingDeployed ? 'text-purple-300' : 'text-slate-500'}>
                  {state.auxShieldingDeployed ? 'Active Magnetic Deflection' : 'Passive Mass Only'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-2">
              Action: Sinter robotic regolith & energize coil
            </div>
            <button
              onClick={onDeployAuxShielding}
              disabled={isFinished || resources.energy < 5}
              className="w-full py-2 text-xs font-mono font-medium rounded bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-700 transition-colors disabled:opacity-50"
            >
              Increase Shielding (+12% / costs 5% pwr)
            </button>
          </div>
        </div>

        {/* 6. Overall Crew Health & Medical Protocol */}
        <div className="bg-[#0b1329] border border-slate-800 rounded p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
              <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-400" />
                OVERALL CREW HEALTH
              </span>
              <span className="text-sm font-mono font-bold text-rose-400">
                {resources.crewHealth.toFixed(1)}%
              </span>
            </div>

            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-300 ${
                  resources.crewHealth < 30
                    ? 'bg-rose-500'
                    : resources.crewHealth < 60
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
                }`}
                style={{ width: `${resources.crewHealth}%` }}
              />
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-400 mb-4">
              <div className="flex justify-between">
                <span>Astronauts Operational:</span>
                <span className="text-slate-200">4 of 4 Members</span>
              </div>
              <div className="flex justify-between">
                <span>Acute Radiation Sickness:</span>
                <span className={resources.radiationShielding < 35 ? 'text-rose-400' : 'text-emerald-400'}>
                  {resources.radiationShielding < 35 ? 'DETECTED' : 'None Detected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Hypoxia Risk:</span>
                <span className={resources.oxygen < 30 ? 'text-rose-400' : 'text-emerald-400'}>
                  {resources.oxygen < 30 ? 'ELEVATED' : 'Within Limits'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Medical Bay Status:</span>
                <span className="text-emerald-400">Ready for Intervention</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-2">
              Action: Radioprotectants & IV Rehydration
            </div>
            <button
              onClick={onPerformMedical}
              disabled={isFinished || resources.energy < 3 || resources.water < 2}
              className="w-full py-2 text-xs font-mono font-medium rounded bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-700 transition-colors disabled:opacity-50"
            >
              Perform Medical Triage (+8% Health)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
