import {
  Astronaut,
  HabitatSystem,
  MissionLogEntry,
  OutpostResources,
  ResourceDeltas,
  SimulationState,
  SystemStatus,
} from '../types/simulation';
import { INCIDENT_CATALOG } from './incidents';

// Baseline daily parameters for 4 astronauts in closed-loop habitat
export const BASE_CONSUMPTION = {
  oxygen: 3.5, // % per day (approx 0.84 kg O2 per crew member/day)
  water: 4.8,  // % per day (approx 2.5 L drinking + 1.5 L hygiene per astronaut)
  food: 3.2,   // % per day (approx 2800 kcal per astronaut)
  baseEnergyDraw: 9.0, // baseline life support, HVAC, communication, lighting
};

export interface AdvanceDayResult {
  nextState: SimulationState;
  dailyDeltas: ResourceDeltas;
  eventsTriggered: string[];
}

export function clamp(val: number, min = 0, max = 100): number {
  return Math.min(Math.max(Number(val.toFixed(1)), min), max);
}

export function determineSystemStatus(resources: OutpostResources): SystemStatus {
  const minVal = Math.min(
    resources.oxygen,
    resources.water,
    resources.food,
    resources.energy,
    resources.radiationShielding,
    resources.crewHealth
  );

  if (minVal <= 0) return 'offline';
  if (minVal < 25) return 'critical';
  if (minVal < 50) return 'warning';
  return 'nominal';
}

export function advanceDay(currentState: SimulationState): AdvanceDayResult {
  if (currentState.status !== 'in-progress') {
    return {
      nextState: currentState,
      dailyDeltas: {
        oxygen: 0,
        water: 0,
        food: 0,
        energy: 0,
        radiationShielding: 0,
        crewHealth: 0,
      },
      eventsTriggered: [],
    };
  }

  const nextDay = currentState.missionDay + 1;
  const eventsTriggered: string[] = [];
  const newLogs: MissionLogEntry[] = [];

  // Track deltas
  const deltas: ResourceDeltas = {
    oxygen: 0,
    water: 0,
    food: 0,
    energy: 0,
    radiationShielding: 0,
    crewHealth: 0,
  };

  // 1. Oxygen consumption and generation
  let oxygenLoss = BASE_CONSUMPTION.oxygen;
  // If greenhouse is active, photosynthetic spirulina/plants generate modest O2
  if (currentState.greenhouseActive) {
    oxygenLoss -= 1.4; // 1.4% recycled by photosynthetic growth
  }
  // ECLSS Sabatier recycling
  const eclssSys = currentState.systems.find((s) => s.id === 'eclss');
  if (eclssSys && eclssSys.operational) {
    const recyclingBonus = (eclssSys.efficiency / 100) * 1.0;
    oxygenLoss -= recyclingBonus;
  }
  deltas.oxygen -= Math.max(0.8, oxygenLoss);

  // 2. Water usage and recycling
  let waterLoss = BASE_CONSUMPTION.water;
  if (currentState.waterRecyclingActive) {
    // Advanced Vapor Compression saves ~75% of water usage
    waterLoss = 1.2; // reclaimed efficiently
  }
  if (currentState.greenhouseActive) {
    // Greenhouse hydroponics consumes additional water
    waterLoss += 1.8;
  }
  deltas.water -= waterLoss;

  // 3. Food consumption and greenhouse yield
  let foodLoss = BASE_CONSUMPTION.food;
  if (currentState.greenhouseActive) {
    // Greenhouse produces fresh nutrient crops (+2.0% food per day)
    foodLoss -= 2.0;
  }
  deltas.food -= Math.max(0.5, foodLoss);

  // 4. Energy generation and consumption
  // Power Generation: Bifacial solar arrays at South Pole Peak of Eternal Light
  // The sun stays low on the horizon, varying slightly as the lunar day progresses
  const solarAngleFactor = 1.0 + Math.sin((currentState.missionDay / 30) * Math.PI) * 0.35;
  let energyGeneration = 8.5 * solarAngleFactor;

  if (currentState.solarTrackingOptimized) {
    energyGeneration *= 1.35; // +35% with dynamic solar alignment
  }

  let energyConsumption = BASE_CONSUMPTION.baseEnergyDraw;
  if (currentState.emergencyPowerSaving) {
    energyConsumption *= 0.55; // 45% reduction in non-vital systems
  }
  if (currentState.waterRecyclingActive) {
    energyConsumption += 2.8;
  }
  if (currentState.greenhouseActive) {
    energyConsumption += 2.5;
  }
  if (currentState.auxShieldingDeployed) {
    energyConsumption += 1.8;
  }

  deltas.energy += energyGeneration - energyConsumption;

  // 5. Radiation exposure & Shielding wear
  // Space radiation (GCR) slowly erodes or stresses outer active systems (-0.8% per day baseline)
  let shieldWear = -0.8;
  if (currentState.auxShieldingDeployed) {
    // Active auxiliary regolith magnetic berm protects habitat (+replaces degradation)
    shieldWear = 2.5; // active maintenance / reinforcement
  }
  deltas.radiationShielding += shieldWear;

  // 6. Check for Incidents / Space Weather events on this day
  const activeIncidentCatalog = INCIDENT_CATALOG.filter(
    (inc) => nextDay >= inc.triggerDayMin && nextDay <= inc.triggerDayMax
  );

  let incidentReport = '';
  // Check random probability or deterministic thresholds
  for (const inc of activeIncidentCatalog) {
    // To make simulation deterministic yet exciting, use day-based pseudo-random
    const pseudoRandom = Math.sin(nextDay * 9301 + 49297) - Math.floor(Math.sin(nextDay * 9301 + 49297));
    if (pseudoRandom < inc.chance) {
      let isMitigated = false;
      if (inc.mitigatedBy === 'shielding' && (currentState.auxShieldingDeployed || currentState.resources.radiationShielding >= 75)) {
        isMitigated = true;
      } else if (inc.mitigatedBy === 'solarOptimization' && currentState.solarTrackingOptimized) {
        isMitigated = true;
      } else if (inc.mitigatedBy === 'waterRecycling' && currentState.waterRecyclingActive) {
        isMitigated = true;
      }

      const effect = inc.applyEffect(currentState.resources, isMitigated);
      incidentReport = effect.report;

      if (effect.deltas.radiationShielding) deltas.radiationShielding += effect.deltas.radiationShielding;
      if (effect.deltas.crewHealth) deltas.crewHealth += effect.deltas.crewHealth;
      if (effect.deltas.water) deltas.water += effect.deltas.water;
      if (effect.deltas.energy) deltas.energy += effect.deltas.energy;

      eventsTriggered.push(`${inc.title}: ${effect.report}`);
      newLogs.push({
        id: `inc-${nextDay}-${inc.id}`,
        day: nextDay,
        timestamp: `Day ${String(nextDay).padStart(2, '0')} - 04:20 UTC`,
        category: 'incident',
        title: inc.title,
        details: effect.report,
        severity: inc.severity,
      });
      break; // maximum 1 major incident per day to keep gameplay balanced
    }
  }

  // 7. Calculate new raw resources before health calculation
  const newOxygen = clamp(currentState.resources.oxygen + deltas.oxygen);
  const newWater = clamp(currentState.resources.water + deltas.water);
  const newFood = clamp(currentState.resources.food + deltas.food);
  const newEnergy = clamp(currentState.resources.energy + deltas.energy);
  const newShielding = clamp(currentState.resources.radiationShielding + deltas.radiationShielding);

  // 8. Crew Health Dynamics
  let healthChange = 0;

  // Severe deprivations have cascading health penalties
  if (newOxygen < 20) {
    healthChange -= (20 - newOxygen) * 0.8;
    eventsTriggered.push('CRITICAL: Oxygen levels dangerously low. Hypoxia onset in crew.');
  } else if (newOxygen < 40) {
    healthChange -= 2.0;
  }

  if (newWater < 20) {
    healthChange -= (20 - newWater) * 0.9;
    eventsTriggered.push('CRITICAL: Severe dehydration warning for crew.');
  } else if (newWater < 40) {
    healthChange -= 2.0;
  }

  if (newFood < 20) {
    healthChange -= (20 - newFood) * 0.4;
  }

  if (newEnergy <= 0) {
    healthChange -= 6.0; // Life support heaters fail in lunar cold
    eventsTriggered.push('CRITICAL: Habitat power loss! Thermal regulation failing.');
  }

  if (newShielding < 30) {
    const radPenalty = (30 - newShielding) * 0.35;
    healthChange -= radPenalty;
  }

  // Natural recovery if all conditions are good
  if (newOxygen > 60 && newWater > 50 && newFood > 50 && newEnergy > 40 && newShielding > 60) {
    healthChange += 1.5; // Crew rests, recovers health up to 100%
  }

  // If power saving is on, minor comfort penalty
  if (currentState.emergencyPowerSaving) {
    healthChange -= 0.5;
  }

  deltas.crewHealth += healthChange;
  const newCrewHealth = clamp(currentState.resources.crewHealth + deltas.crewHealth);

  const updatedResources: OutpostResources = {
    oxygen: newOxygen,
    water: newWater,
    food: newFood,
    energy: newEnergy,
    radiationShielding: newShielding,
    crewHealth: newCrewHealth,
  };

  // 9. Update Astronaut Biometrics & Statuses
  const updatedCrew: Astronaut[] = currentState.crew.map((astronaut, idx) => {
    // Individual slight variance based on role exposure
    const astronautHealth = clamp(newCrewHealth + (idx === 0 ? 1 : idx === 2 ? -1 : 0));
    
    let status: Astronaut['status'] = 'Nominal';
    if (astronautHealth < 25) status = 'Critical';
    else if (newOxygen < 30) status = 'Mild Hypoxia';
    else if (newWater < 30) status = 'Dehydrated';
    else if (newShielding < 35) status = 'Radiation Sickness';
    else if (astronautHealth < 60) status = 'Fatigued';

    const radDoseIncrement = (100 - newShielding) * 0.04 + (incidentReport ? 0.3 : 0.05);
    const oxygenSaturation = Math.round(clamp(90 + (newOxygen / 100) * 10, 75, 100));
    const heartRate = Math.round(60 + (100 - astronautHealth) * 0.45 + (status === 'Dehydrated' ? 18 : 0));

    return {
      ...astronaut,
      health: astronautHealth,
      status,
      radiationDose: Number((astronaut.radiationDose + radDoseIncrement).toFixed(2)),
      oxygenSaturation,
      heartRate,
      morale: clamp(Math.round(astronautHealth * 0.8 + (newFood > 40 ? 15 : 0))),
    };
  });

  // 10. Habitat Systems Status Sync
  const updatedSystems: HabitatSystem[] = currentState.systems.map((sys) => {
    let operational = sys.operational;
    let efficiency = sys.efficiency;
    let status: SystemStatus = 'nominal';

    if (sys.id === 'water-recycling') {
      operational = currentState.waterRecyclingActive;
      status = operational ? (newWater < 25 ? 'warning' : 'nominal') : 'offline';
    } else if (sys.id === 'greenhouse') {
      operational = currentState.greenhouseActive;
      status = operational ? 'nominal' : 'offline';
    } else if (sys.id === 'solar-grid') {
      efficiency = currentState.solarTrackingOptimized ? 95 : 82;
      status = newEnergy < 20 ? 'warning' : 'nominal';
    } else if (sys.id === 'radiation-shield') {
      efficiency = Math.round(newShielding);
      status = newShielding < 30 ? 'critical' : newShielding < 60 ? 'warning' : 'nominal';
    } else if (sys.id === 'eclss') {
      status = newOxygen < 30 ? 'critical' : newOxygen < 60 ? 'warning' : 'nominal';
    }

    if (newEnergy <= 0) {
      status = 'offline';
      operational = false;
    }

    return {
      ...sys,
      operational,
      efficiency,
      status,
    };
  });

  // 11. Determine Mission Success or Failure
  let missionStatus: SimulationState['status'] = 'in-progress';
  let failureReason: string | undefined;

  if (newCrewHealth <= 0) {
    missionStatus = 'failed';
    failureReason = 'MISSION TERMINATED: Crew biometrics dropped below minimum survivability threshold.';
  } else if (newOxygen <= 0) {
    missionStatus = 'failed';
    failureReason = 'MISSION TERMINATED: Complete atmospheric ECLSS failure. Oxygen reserves depleted to 0%.';
  } else if (newWater <= 0) {
    missionStatus = 'failed';
    failureReason = 'MISSION TERMINATED: Potable water reserves completely exhausted.';
  } else if (newEnergy <= 0 && currentState.missionDay >= 3) {
    // If energy stays zero
    if (currentState.resources.energy <= 0) {
      missionStatus = 'failed';
      failureReason = 'MISSION TERMINATED: Extended blackout resulted in catastrophic life support freeze.';
    }
  } else if (nextDay >= currentState.maxDays) {
    missionStatus = 'succeeded';
  }

  // 12. Create Daily Routine Log Entry
  const summaryLog: MissionLogEntry = {
    id: `log-day-${nextDay}`,
    day: nextDay,
    timestamp: `Day ${String(nextDay).padStart(2, '0')} - 23:59 UTC`,
    category: 'system',
    title: `Mission Day ${nextDay} Completed`,
    details: `O2: ${newOxygen}% (${deltas.oxygen >= 0 ? '+' : ''}${deltas.oxygen.toFixed(1)}%) | H2O: ${newWater}% (${deltas.water >= 0 ? '+' : ''}${deltas.water.toFixed(1)}%) | Food: ${newFood}% (${deltas.food >= 0 ? '+' : ''}${deltas.food.toFixed(1)}%) | Energy: ${newEnergy}% (${deltas.energy >= 0 ? '+' : ''}${deltas.energy.toFixed(1)}%)`,
    resourceImpact: deltas,
    severity: missionStatus === 'failed' ? 'critical' : missionStatus === 'succeeded' ? 'success' : 'info',
  };

  // Depletion warning logs
  if (newOxygen < 25 && currentState.resources.oxygen >= 25) {
    newLogs.push({
      id: `alert-o2-${nextDay}`,
      day: nextDay,
      timestamp: `Day ${String(nextDay).padStart(2, '0')} - 12:00 UTC`,
      category: 'alert',
      title: 'Low Oxygen Warning',
      details: 'Atmospheric oxygen below 25%. Restrict high-intensity EVA tasks immediately.',
      severity: 'warning',
    });
  }
  if (newWater < 25 && currentState.resources.water >= 25) {
    newLogs.push({
      id: `alert-h2o-${nextDay}`,
      day: nextDay,
      timestamp: `Day ${String(nextDay).padStart(2, '0')} - 12:00 UTC`,
      category: 'alert',
      title: 'Water Reserves Warning',
      details: 'Potable water below 25%. Activate water recycling loop or reduce greenhouse consumption.',
      severity: 'warning',
    });
  }
  if (newEnergy < 20 && currentState.resources.energy >= 20) {
    newLogs.push({
      id: `alert-energy-${nextDay}`,
      day: nextDay,
      timestamp: `Day ${String(nextDay).padStart(2, '0')} - 14:30 UTC`,
      category: 'alert',
      title: 'Power Grid Critical Warning',
      details: 'Available power reserves dropped below 20%. Engage Emergency Power-Saving mode.',
      severity: 'critical',
    });
  }

  const finalLogs = [summaryLog, ...newLogs, ...currentState.logs];

  const newHistoryPoint = {
    day: nextDay,
    oxygen: newOxygen,
    water: newWater,
    food: newFood,
    energy: newEnergy,
    radiationShielding: newShielding,
    crewHealth: newCrewHealth,
  };

  const nextState: SimulationState = {
    ...currentState,
    missionDay: nextDay,
    status: missionStatus,
    failureReason,
    overallStatus: determineSystemStatus(updatedResources),
    resources: updatedResources,
    crew: updatedCrew,
    systems: updatedSystems,
    history: [...currentState.history, newHistoryPoint],
    logs: finalLogs,
    queuedActions: [], // reset queued per-turn actions
  };

  return {
    nextState,
    dailyDeltas: deltas,
    eventsTriggered,
  };
}

// Interactive Commander Directives (working actions with direct feedback and cost)
export function toggleWaterRecycling(state: SimulationState): SimulationState {
  const willBeActive = !state.waterRecyclingActive;
  const log: MissionLogEntry = {
    id: `act-${Date.now()}`,
    day: state.missionDay,
    timestamp: `Day ${String(state.missionDay).padStart(2, '0')} - Decision`,
    category: 'action',
    title: willBeActive ? 'Activated Water Recovery Loop' : 'Deactivated Water Recovery Loop',
    details: willBeActive
      ? 'Vapor compression distiller online. Recovers 75% graywater at a continuous 2.8 kW electrical load.'
      : 'Water recycling shut down. Reduced power consumption but water consumption will increase drastically.',
    severity: willBeActive ? 'info' : 'warning',
  };

  return {
    ...state,
    waterRecyclingActive: willBeActive,
    logs: [log, ...state.logs],
  };
}

export function toggleSolarOptimization(state: SimulationState): SimulationState {
  // Cost: 4% energy for high-torque servo realignments, but provides +35% ongoing solar harvest
  const willBeActive = !state.solarTrackingOptimized;
  let newEnergy = state.resources.energy;
  if (willBeActive) {
    newEnergy = clamp(newEnergy - 3.0);
  }

  const log: MissionLogEntry = {
    id: `act-${Date.now()}`,
    day: state.missionDay,
    timestamp: `Day ${String(state.missionDay).padStart(2, '0')} - Decision`,
    category: 'action',
    title: willBeActive ? 'Optimized Solar Array Tracking' : 'Reset Solar Arrays to Fixed Pitch',
    details: willBeActive
      ? 'Re-aligned bifacial PV towers with the shifting lunar horizon. Expended 3% energy to boost daily solar generation by +35%.'
      : 'Disabled active sun tracking servos to conserve motor drive power.',
    severity: 'info',
  };

  return {
    ...state,
    solarTrackingOptimized: willBeActive,
    resources: {
      ...state.resources,
      energy: newEnergy,
    },
    logs: [log, ...state.logs],
  };
}

export function deployAuxShielding(state: SimulationState): SimulationState {
  // Costs 5% energy to run electromagnetic deflectors and robotic regolith redistribution
  if (state.resources.energy < 5) return state;

  const newShielding = clamp(state.resources.radiationShielding + 12);
  const newEnergy = clamp(state.resources.energy - 5);

  const log: MissionLogEntry = {
    id: `act-${Date.now()}`,
    day: state.missionDay,
    timestamp: `Day ${String(state.missionDay).padStart(2, '0')} - Decision`,
    category: 'action',
    title: 'Reinforced Regolith Radiation Shielding',
    details: 'Deployed automated regolith sintering arm and charged electromagnetic deflection coil. Shielding integrity restored by +12% at the cost of 5% energy reserves.',
    severity: 'success',
  };

  return {
    ...state,
    auxShieldingDeployed: true,
    resources: {
      ...state.resources,
      radiationShielding: newShielding,
      energy: newEnergy,
    },
    logs: [log, ...state.logs],
  };
}

export function toggleGreenhouse(state: SimulationState): SimulationState {
  const willBeActive = !state.greenhouseActive;
  
  const log: MissionLogEntry = {
    id: `act-${Date.now()}`,
    day: state.missionDay,
    timestamp: `Day ${String(state.missionDay).padStart(2, '0')} - Decision`,
    category: 'action',
    title: willBeActive ? 'Initiated Hydroponic Greenhouse Production' : 'Mothballed Greenhouse Chamber',
    details: willBeActive
      ? 'Aeroponic grow lights and spirulina vats powered up. Consumes 1.8% extra water and 2.5% energy daily; yields fresh food (+2.0%/day) and O2 supplemental scrubbing.'
      : 'Hydroponics placed on dormant standby to preserve critical water and power.',
    severity: willBeActive ? 'info' : 'warning',
  };

  return {
    ...state,
    greenhouseActive: willBeActive,
    logs: [log, ...state.logs],
  };
}

export function toggleEmergencyPowerSaving(state: SimulationState): SimulationState {
  const willBeActive = !state.emergencyPowerSaving;

  const log: MissionLogEntry = {
    id: `act-${Date.now()}`,
    day: state.missionDay,
    timestamp: `Day ${String(state.missionDay).padStart(2, '0')} - Decision`,
    category: 'action',
    title: willBeActive ? 'ENTERED EMERGENCY POWER-SAVING MODE' : 'Disengaged Power-Saving Mode',
    details: willBeActive
      ? 'Non-critical lighting dimmed, laboratory equipment throttled, HVAC temperature setpoint lowered. Base power draw slashed by 45%.'
      : 'Standard habitat operations restored. All laboratory and science bays returned to full power.',
    severity: willBeActive ? 'warning' : 'info',
  };

  return {
    ...state,
    emergencyPowerSaving: willBeActive,
    logs: [log, ...state.logs],
  };
}

export function performMedicalTreatment(state: SimulationState): SimulationState {
  // Costs 3% energy and 2% water (sterile saline / medical bay power), restores crew health by +8%
  if (state.resources.energy < 3 || state.resources.water < 2) return state;

  const newHealth = clamp(state.resources.crewHealth + 8);
  const newEnergy = clamp(state.resources.energy - 3);
  const newWater = clamp(state.resources.water - 2);

  const updatedCrew = state.crew.map((c) => ({
    ...c,
    health: clamp(c.health + 8),
    status: (c.health + 8 >= 80 ? 'Nominal' : c.status === 'Critical' ? 'Fatigued' : c.status) as Astronaut['status'],
    morale: clamp(c.morale + 10),
  }));

  const log: MissionLogEntry = {
    id: `act-${Date.now()}`,
    day: state.missionDay,
    timestamp: `Day ${String(state.missionDay).padStart(2, '0')} - Decision`,
    category: 'crew',
    title: 'Medical Bay Intensive Therapy Protocol',
    details: 'Administered anti-radiation radioprotectants, hyperbaric oxygen therapy, and rehydration IVs. Crew overall health boosted by +8%. Expended 3% energy and 2% potable water.',
    severity: 'success',
  };

  return {
    ...state,
    resources: {
      ...state.resources,
      crewHealth: newHealth,
      energy: newEnergy,
      water: newWater,
    },
    crew: updatedCrew,
    logs: [log, ...state.logs],
  };
}
