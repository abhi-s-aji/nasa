import { IncidentAlert, OutpostResources, ResourceDeltas } from '../types/simulation';

export interface PossibleIncident {
  id: string;
  triggerDayMin: number;
  triggerDayMax: number;
  chance: number; // 0 to 1
  title: string;
  description: string;
  severity: 'warning' | 'critical';
  mitigatedBy?: 'shielding' | 'powerSaving' | 'solarOptimization' | 'waterRecycling';
  applyEffect: (resources: OutpostResources, isMitigated: boolean) => {
    deltas: Partial<ResourceDeltas>;
    report: string;
  };
}

export const INCIDENT_CATALOG: PossibleIncident[] = [
  {
    id: 'solar-proton-event',
    triggerDayMin: 4,
    triggerDayMax: 10,
    chance: 0.7,
    title: 'Solar Particle Event (SPE) Alert',
    description: 'NOAA Space Weather Prediction Center detects Class M solar flare directed along Earth-Moon vector. Solar energetic protons (SEP) flux arriving at Shackleton perimeter.',
    severity: 'critical',
    mitigatedBy: 'shielding',
    applyEffect: (resources, isMitigated) => {
      if (isMitigated || resources.radiationShielding >= 75) {
        return {
          deltas: {
            radiationShielding: -6,
            crewHealth: -2,
          },
          report: 'Regolith dome and active magnetic deflector absorbed bulk proton flux. Crew received minimal dose (0.3 mSv). Radiation shielding degraded by 6%.',
        };
      } else {
        return {
          deltas: {
            radiationShielding: -12,
            crewHealth: -10,
          },
          report: 'CRITICAL: Insufficient shielding! Crew quarters exposed to elevated ionizing flux. Acute radiation symptoms observed. Crew health dropped by 10%.',
        };
      }
    },
  },
  {
    id: 'dust-deposition',
    triggerDayMin: 11,
    triggerDayMax: 18,
    chance: 0.65,
    title: 'Electrostatic Lunar Dust Accumulation',
    description: 'Sub-micron abrasive lunar dust particles lifted by terminator line plasma levitation have settled on the bifacial photovoltaic array surface.',
    severity: 'warning',
    mitigatedBy: 'solarOptimization',
    applyEffect: (resources, isMitigated) => {
      if (isMitigated) {
        return {
          deltas: {
            energy: -3,
          },
          report: 'Electrodynamic dust shield (EDS) shaker protocol cleared 80% of regolith fines. Net energy output remained stable with only 3% loss.',
        };
      } else {
        return {
          deltas: {
            energy: -10,
          },
          report: 'Severe dust obscuration on solar panels reduced array photovoltage. Outpost energy production dropped by 10% until arrays are cleaned.',
        };
      }
    },
  },
  {
    id: 'water-filter-clog',
    triggerDayMin: 15,
    triggerDayMax: 24,
    chance: 0.6,
    title: 'WRS Multi-filtration Bed Saturation',
    description: 'Catalytic oxidizer and zeolite particulate bed in the Water Recovery System have reached particulate threshold sooner than planned.',
    severity: 'warning',
    mitigatedBy: 'waterRecycling',
    applyEffect: (resources, isMitigated) => {
      if (isMitigated) {
        return {
          deltas: {
            water: -3,
            energy: -2,
          },
          report: 'Secondary automated backwash cycle cleared the bed. Moderate water loss during purge (-3%) and small power penalty (-2%).',
        };
      } else {
        return {
          deltas: {
            water: -8,
            crewHealth: -3,
          },
          report: 'Recycler bypass engaged. Unfiltered graywater diverted to emergency holding tank. Daily recovery dropped sharply (-8% water reserves).',
        };
      }
    },
  },
  {
    id: 'micrometeorite-impact',
    triggerDayMin: 22,
    triggerDayMax: 28,
    chance: 0.55,
    title: 'Hypervelocity Micrometeorite Strike on Outer Berm',
    description: 'A 2mm micrometeoroid impacted the southern sintered regolith berm at 24 km/s, triggering acoustic vibration sensors in Habitat Sector 3.',
    severity: 'warning',
    mitigatedBy: 'shielding',
    applyEffect: (resources, isMitigated) => {
      if (isMitigated) {
        return {
          deltas: {
            radiationShielding: -5,
          },
          report: 'Regolith whipple bumper absorbed kinetic energy without pressure breach. Shield integrity reduced by 5%.',
        };
      } else {
        return {
          deltas: {
            radiationShielding: -10,
            energy: -4,
          },
          report: 'Impact breached exterior sensor harness and cratered regolith berm. Auxiliary shielding decreased by 10% and repair load drew 4% energy.',
        };
      }
    },
  },
];
