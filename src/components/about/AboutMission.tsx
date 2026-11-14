import React from 'react';
import {
  Info,
  BookOpen,
  Atom,
  ShieldCheck,
  AlertOctagon,
  Compass,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';

export const AboutMission: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Banner */}
      <div className="bg-[#0b1329] border border-slate-800 rounded p-5">
        <div className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold mb-1">
          NASA Space Apps Challenge 2026
        </div>
        <h1 className="text-xl font-bold font-mono text-white tracking-tight">
          OUTPOST — Science & Assumptions
        </h1>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Mission Commander training simulator built for the challenge: <span className="text-slate-200">"Build a Junior Astronaut Mission Trainer"</span>.
          This interactive module models closed-loop life support and resource tradeoffs for an expedition to the Lunar South Pole.
        </p>
      </div>

      {/* Official Educational Disclaimer (Mandatory Requirement) */}
      <div className="p-4 bg-slate-900 border border-slate-700 rounded text-xs font-mono">
        <div className="flex items-center gap-2 text-cyan-300 font-bold uppercase mb-1.5">
          <Info className="w-4 h-4 text-cyan-400" />
          Educational Simulation Disclaimer
        </div>
        <p className="text-slate-300 font-sans leading-relaxed">
          <strong>OUTPOST is an educational training simulation designed for educational demonstration and student engagement.</strong> It is not an official NASA mission control tool, nor does it ingest live telemetry from NASA spacecraft. The simulation formulas use realistic principles of aerospace engineering, thermodynamics, and human spaceflight physiology, simplified into discrete daily turns for clear learning outcomes.
        </p>
      </div>

      {/* Science & Assumptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* ECLSS Section */}
        <div className="bg-[#0b1329] border border-slate-800 rounded p-5 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-semibold">
            <Atom className="w-4 h-4" />
            1. Life Support & ECLSS Mechanics
          </div>
          <div className="text-xs text-slate-300 space-y-2 font-sans leading-relaxed">
            <p>
              In real aerospace habitats (such as the International Space Station and the planned Lunar Gateway and Artemis Base Camp), the <strong>Environmental Control and Life Support System (ECLSS)</strong> manages atmospheric pressure, carbon dioxide scrubbing, trace contaminant removal, and water reclamation.
            </p>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 font-mono text-[11px] space-y-1">
              <div className="text-slate-400 font-semibold uppercase">Real NASA Engineering Specs:</div>
              <div>• Human O₂ Consumption: ~0.84 kg per astronaut / day</div>
              <div>• Drinking & Food Hydration: ~2.5 Liters per astronaut / day</div>
              <div>• ISS Urine Processor Assembly (UPA): Reclaims ~93-98% water</div>
              <div>• Sabatier CO₂ Reduction: CO₂ + 4H₂ → CH₄ + 2H₂O</div>
            </div>
            <p>
              <strong>Simulator Simplification:</strong> Rather than modeling gaseous partial pressures and fluid kilograms directly, OUTPOST normalizes stores into 0–100% capacity indices to teach players system-level trade-offs between electrical power, consumable preservation, and crew health.
            </p>
          </div>
        </div>

        {/* Lunar South Pole Environment */}
        <div className="bg-[#0b1329] border border-slate-800 rounded p-5 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-semibold">
            <Compass className="w-4 h-4" />
            2. Lunar South Pole Environment
          </div>
          <div className="text-xs text-slate-300 space-y-2 font-sans leading-relaxed">
            <p>
              The outpost is set at the <strong>Shackleton Crater rim (89.9°S)</strong>. The South Pole is humanity’s primary target for sustained lunar presence because elevated ridges experience near-permanent sunlight ("Peaks of Eternal Light"), while adjacent deep craters are Permanently Shadowed Regions (PSRs) harboring billions of metric tons of water ice.
            </p>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 font-mono text-[11px] space-y-1">
              <div className="text-slate-400 font-semibold uppercase">Environmental Realities:</div>
              <div>• Solar grazing angle: Sun skims the horizon at 1.5°</div>
              <div>• Temperature extremes: -230°C in shadow to +120°C in sun</div>
              <div>• Dust hazard: Abrasive, electrostatically charged regolith</div>
              <div>• Synodic day cycle: ~29.5 Earth days per lunar day-night</div>
            </div>
            <p>
              <strong>Simulator Representation:</strong> Photovoltaic generation varies with solar azimuth, and random dust deposition events can coat panel optics until an automated shaking or EVA sweep occurs.
            </p>
          </div>
        </div>

        {/* Radiation & Regolith Shielding */}
        <div className="bg-[#0b1329] border border-slate-800 rounded p-5 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-semibold">
            <ShieldCheck className="w-4 h-4" />
            3. Deep Space Radiation & Shielding
          </div>
          <div className="text-xs text-slate-300 space-y-2 font-sans leading-relaxed">
            <p>
              Unlike Earth, the Moon lacks a global geomagnetic field and dense atmosphere. Lunar astronauts face two primary radiation hazards:
            </p>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 font-mono text-[11px] space-y-1">
              <div>• <strong>Galactic Cosmic Rays (GCR):</strong> Steady, highly penetrating heavy relativistic ions from outside the solar system (~0.3–0.6 mSv/day).</div>
              <div>• <strong>Solar Particle Events (SPE):</strong> Unpredictable coronal bursts emitting high-flux proton waves capable of lethal acute doses if unshielded.</div>
            </div>
            <p>
              <strong>Engineering Solution:</strong> Sintered regolith berms (using microwave or concentrated solar sintering of lunar soil) placed over habitat modules offer both thermal inertia and mass radiation shielding. In OUTPOST, reinforcing shielding consumes auxiliary power but cushions against unpredictable solar flare events.
            </p>
          </div>
        </div>

        {/* Closed Loop Bioregenerative Life Support */}
        <div className="bg-[#0b1329] border border-slate-800 rounded p-5 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-semibold">
            <BookOpen className="w-4 h-4" />
            4. Bioregenerative Greenhouse & Food
          </div>
          <div className="text-xs text-slate-300 space-y-2 font-sans leading-relaxed">
            <p>
              Carrying all food from Earth is mass-prohibitive for permanent surface bases. Aeroponics and microalgae bioreactors (such as Spirulina) represent the second phase of ECLSS evolution:
            </p>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 font-mono text-[11px] space-y-1">
              <div>• Photosynthetic conversion: Absorbs crew CO₂, yields pure O₂</div>
              <div>• Fresh micronutrients: Essential vitamins that degrade in prepackaged rations</div>
              <div>• Tradeoff: Consumes active water loops and continuous LED wattage</div>
            </div>
            <p>
              <strong>In OUTPOST:</strong> Activating the greenhouse replenishes food and supplements oxygen, but requires reliable surplus water and electric power.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Rules Summary */}
      <div className="bg-[#0b1329] border border-slate-800 rounded p-5">
        <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-3">
          Simulation Rules & Win / Loss Conditions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <div className="text-emerald-400 font-bold mb-1">VICTORY CONDITION</div>
            <p className="text-slate-300 font-sans">
              Maintain life support and keep all 4 astronauts alive across all <strong>30 Lunar Days</strong>.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <div className="text-rose-400 font-bold mb-1">FAILURE CONDITIONS</div>
            <p className="text-slate-300 font-sans">
              Outpost fails if <strong>Oxygen</strong>, <strong>Water</strong>, or <strong>Crew Health</strong> reaches 0%, or prolonged blackout freezes life support.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <div className="text-cyan-400 font-bold mb-1">STRATEGIC TRADEOFFS</div>
            <p className="text-slate-300 font-sans">
              Balance power between water recycling, active greenhouse growth, solar servo alignment, and radiation berm maintenance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
