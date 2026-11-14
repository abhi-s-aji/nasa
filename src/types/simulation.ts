export type MissionTab =
  | 'overview'
  | 'resources'
  | 'crew'
  | 'habitat'
  | 'logs'
  | 'about';

export type SystemStatus = 'nominal' | 'warning' | 'critical' | 'offline';

export interface OutpostResources {
  oxygen: number; // 0 - 100%
  water: number; // 0 - 100%
  food: number; // 0 - 100%
  energy: number; // 0 - 100%
  radiationShielding: number; // 0 - 100%
  crewHealth: number; // 0 - 100%
}

export interface ResourceDeltas {
  oxygen: number;
  water: number;
  food: number;
  energy: number;
  radiationShielding: number;
  crewHealth: number;
}

export interface Astronaut {
  id: string;
  name: string;
  role: string;
  callsign: string;
  health: number; // 0 - 100%
  status: 'Nominal' | 'Fatigued' | 'Mild Hypoxia' | 'Radiation Sickness' | 'Dehydrated' | 'Critical';
  assignedTask: string;
  heartRate: number; // bpm
  oxygenSaturation: number; // SpO2 %
  radiationDose: number; // mSv accumulated
  morale: number; // 0 - 100%
}

export interface HabitatSystem {
  id: string;
  name: string;
  subsystem: string;
  operational: boolean;
  efficiency: number; // 0 - 100%
  powerDrawKw: number; // kW equivalent or % impact
  status: SystemStatus;
  description: string;
  impactDescription: string;
}

export type LogCategory = 'system' | 'action' | 'incident' | 'alert' | 'crew';

export interface MissionLogEntry {
  id: string;
  day: number;
  timestamp: string; // e.g., "Sol 12 - 08:30 UTC"
  category: LogCategory;
  title: string;
  details: string;
  resourceImpact?: Partial<ResourceDeltas>;
  severity: 'info' | 'warning' | 'critical' | 'success';
}

export interface TurnAction {
  id: string;
  name: string;
  category: 'water' | 'energy' | 'shielding' | 'greenhouse' | 'emergency' | 'medical';
  description: string;
  costDescription: string;
  effectDescription: string;
  isActive?: boolean; // for toggle states like power-saving
  isPendingForNextDay?: boolean; // queued action
  cooldown?: number;
  applyImmediate?: boolean;
}

export interface HistoricalDataPoint {
  day: number;
  oxygen: number;
  water: number;
  food: number;
  energy: number;
  radiationShielding: number;
  crewHealth: number;
}

export interface IncidentAlert {
  id: string;
  day: number;
  title: string;
  description: string;
  severity: 'warning' | 'critical';
  resolved: boolean;
  effectApplied?: string;
}

export interface SimulationState {
  missionDay: number; // 1 to 30
  maxDays: number; // 30
  status: 'in-progress' | 'succeeded' | 'failed';
  failureReason?: string;
  overallStatus: SystemStatus;
  resources: OutpostResources;
  crew: Astronaut[];
  systems: HabitatSystem[];
  logs: MissionLogEntry[];
  history: HistoricalDataPoint[];
  activeIncidents: IncidentAlert[];
  
  // Active policy toggles
  waterRecyclingActive: boolean;
  solarTrackingOptimized: boolean;
  greenhouseActive: boolean;
  emergencyPowerSaving: boolean;
  auxShieldingDeployed: boolean;
  
  // Pending actions selected by the commander for this day
  queuedActions: string[];
}
