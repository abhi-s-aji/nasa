import { SimulationState } from '../types/simulation';
import { INITIAL_STATE } from './initialState';

const STORAGE_KEY = 'outpost_artemis_mission_state_v1';

export function loadSimulationState(): SimulationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as SimulationState;
    if (parsed && typeof parsed.missionDay === 'number' && parsed.resources) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load mission state from localStorage, using initial baseline', err);
  }
  return INITIAL_STATE;
}

export function saveSimulationState(state: SimulationState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save mission state to localStorage', err);
  }
}

export function clearSimulationState(): SimulationState {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear mission state from localStorage', err);
  }
  return INITIAL_STATE;
}
