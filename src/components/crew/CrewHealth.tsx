import React from 'react';
import {
  Users,
  HeartPulse,
  Activity,
  Shield,
  Stethoscope,
  Radio,
  Award,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { SimulationState, Astronaut } from '../../types/simulation';

interface CrewHealthProps {
  state: SimulationState;
  onPerformMedical: () => void;
}

export const CrewHealth: React.FC<CrewHealthProps> = ({
  state,
  onPerformMedical,
}) => {
  const { crew, resources, status } = state;
  const isFinished = status !== 'in-progress';

  // Overall crew summary condition
  const avgHealth = Math.round(
    crew.reduce((acc, c) => acc + c.health, 0) / crew.length
  );
  const maxRadDose = Math.max(...crew.map((c) => c.radiationDose));
  const compromisedCrew = crew.filter((c) => c.status !== 'Nominal');

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary */}
      <div className="bg-[#0b1329] border border-slate-800 rounded p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold mb-1">
            Artemis Outpost Expedition Roster
          </div>
          <h1 className="text-xl font-bold font-mono text-white tracking-tight">
            Astronaut Health & Biomedical Telemetry
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time biometric monitoring of the 4 lunar explorers. Physiological stress tracks oxygen availability, hydration, caloric intake, and cosmic radiation dose.
          </p>
        </div>

        {/* Quick Medical Bay button */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-mono uppercase text-slate-400">
              Avg Health Index
            </div>
            <div className="text-lg font-mono font-bold text-rose-400">
              {avgHealth}%
            </div>
          </div>

          <button
            onClick={onPerformMedical}
            disabled={
              isFinished ||
              resources.energy < 3 ||
              resources.water < 2
            }
            className="px-4 py-2.5 text-xs font-mono font-medium rounded bg-rose-900/80 hover:bg-rose-800 text-rose-100 border border-rose-600 transition-colors flex items-center gap-2 shadow disabled:opacity-50"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Administer Medical Therapy</span>
          </button>
        </div>
      </div>

      {/* Crew Condition Analysis Card */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded">
        <h2 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-2 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          Habitability & Environmental Impact Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-slate-300 pt-1">
          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <div className="text-slate-400 text-[11px] mb-1">Physiological Status</div>
            <div className="font-semibold text-slate-100 flex items-center gap-2">
              {compromisedCrew.length === 0 ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All 4 Nominal
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> {compromisedCrew.length} Affected
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {resources.oxygen < 30
                ? 'Elevated risk of hypoxia and cognitive fatigue.'
                : resources.water < 30
                ? 'Dehydration symptoms detected.'
                : 'Metabolic rates balanced with ECLSS atmospheric pressure.'}
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <div className="text-slate-400 text-[11px] mb-1">Cumulative Radiation Exposure</div>
            <div className="font-semibold text-slate-100">
              Peak: <span className="text-purple-400">{maxRadDose.toFixed(2)} mSv</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              NASA 30-day career exploration target: &lt; 50 mSv.
              {resources.radiationShielding >= 75
                ? ' Regolith dome attenuating 92% of ambient flux.'
                : ' Elevated flux penetration due to degraded shielding.'}
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <div className="text-slate-400 text-[11px] mb-1">Nutrition & Hydration Loop</div>
            <div className="font-semibold text-slate-100">
              {state.greenhouseActive ? (
                <span className="text-emerald-400">Fresh Biomass Supplement</span>
              ) : (
                <span className="text-slate-300">Standard Shelf-Stable Packets</span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Daily crew caloric burn: ~2,800 kcal/person. Water intake: 2.5L drinking per sol.
            </div>
          </div>
        </div>
      </div>

      {/* 4 Astronaut Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {crew.map((astronaut) => {
          const isCritical = astronaut.health < 25;
          const isWarning = !isCritical && astronaut.health < 60;

          const statusColor = {
            Nominal: 'bg-emerald-950/60 text-emerald-300 border-emerald-800',
            Fatigued: 'bg-amber-950/60 text-amber-300 border-amber-800',
            'Mild Hypoxia': 'bg-rose-950/60 text-rose-300 border-rose-800',
            'Radiation Sickness': 'bg-purple-950/60 text-purple-300 border-purple-800',
            Dehydrated: 'bg-blue-950/60 text-blue-300 border-blue-800',
            Critical: 'bg-rose-950 text-rose-200 border-rose-600 animate-pulse',
          }[astronaut.status];

          return (
            <div
              key={astronaut.id}
              className="bg-[#0b1329] border border-slate-800 rounded p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header: Name, Callsign, Status */}
                <div className="flex items-start justify-between gap-3 mb-3 border-b border-slate-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold font-mono text-white">
                        {astronaut.name}
                      </h3>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {astronaut.callsign}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-cyan-400 mt-0.5">
                      {astronaut.role}
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${statusColor}`}
                  >
                    {astronaut.status.toUpperCase()}
                  </span>
                </div>

                {/* Health Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center text-xs font-mono mb-1">
                    <span className="text-slate-400">Vital Health Index:</span>
                    <span
                      className={`font-bold ${
                        isCritical
                          ? 'text-rose-400'
                          : isWarning
                          ? 'text-amber-400'
                          : 'text-slate-200'
                      }`}
                    >
                      {astronaut.health.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isCritical
                          ? 'bg-rose-500'
                          : isWarning
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                      style={{ width: `${astronaut.health}%` }}
                    />
                  </div>
                </div>

                {/* Biometrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 bg-slate-950 p-2.5 rounded border border-slate-800/80 font-mono text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Heart Rate</div>
                    <div className="text-slate-200 font-semibold">{astronaut.heartRate} bpm</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">SpO₂</div>
                    <div className="text-slate-200 font-semibold">{astronaut.oxygenSaturation}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Rad Dose</div>
                    <div className="text-purple-300 font-semibold">{astronaut.radiationDose} mSv</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Morale</div>
                    <div className="text-slate-200 font-semibold">{astronaut.morale}%</div>
                  </div>
                </div>

                {/* Assigned Responsibilities */}
                <div className="text-xs font-mono">
                  <span className="text-slate-400 block mb-1 uppercase text-[10px] tracking-wider">
                    Assigned Outpost Responsibilities:
                  </span>
                  <div className="p-2 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    {astronaut.assignedTask}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
