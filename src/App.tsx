import React, { useState, useEffect } from 'react';
import { MissionTab, SimulationState, ResourceDeltas } from './types/simulation';
import {
  advanceDay,
  toggleWaterRecycling,
  toggleSolarOptimization,
  deployAuxShielding,
  toggleGreenhouse,
  toggleEmergencyPowerSaving,
  performMedicalTreatment,
} from './simulation/engine';
import {
  loadSimulationState,
  saveSimulationState,
  clearSimulationState,
} from './simulation/storage';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { MissionOverview } from './components/dashboard/MissionOverview';
import { ResourceManagement } from './components/resources/ResourceManagement';
import { CrewHealth } from './components/crew/CrewHealth';
import { HabitatSystems } from './components/habitat/HabitatSystems';
import { MissionLog } from './components/logs/MissionLog';
import { AboutMission } from './components/about/AboutMission';
import { ConfirmModal } from './components/common/ConfirmModal';
import { DayAdvanceModal } from './components/dashboard/DayAdvanceModal';

export const App: React.FC = () => {
  const [state, setState] = useState<SimulationState>(() => loadSimulationState());
  const [currentTab, setCurrentTab] = useState<MissionTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Day transition summary modal
  const [advanceModalData, setAdvanceModalData] = useState<{
    isOpen: boolean;
    day: number;
    deltas: ResourceDeltas;
    events: string[];
  }>({
    isOpen: false,
    day: 1,
    deltas: {
      oxygen: 0,
      water: 0,
      food: 0,
      energy: 0,
      radiationShielding: 0,
      crewHealth: 0,
    },
    events: [],
  });

  // Persist state to localStorage on update
  useEffect(() => {
    saveSimulationState(state);
  }, [state]);

  // Handler: Advance Day
  const handleAdvanceDay = () => {
    if (state.status !== 'in-progress') return;

    const previousDay = state.missionDay;
    const { nextState, dailyDeltas, eventsTriggered } = advanceDay(state);
    setState(nextState);

    setAdvanceModalData({
      isOpen: true,
      day: previousDay,
      deltas: dailyDeltas,
      events: eventsTriggered,
    });
  };

  // Actions
  const handleToggleWaterRecycling = () => {
    setState((prev) => toggleWaterRecycling(prev));
  };

  const handleToggleSolarOptimization = () => {
    setState((prev) => toggleSolarOptimization(prev));
  };

  const handleDeployAuxShielding = () => {
    setState((prev) => deployAuxShielding(prev));
  };

  const handleToggleGreenhouse = () => {
    setState((prev) => toggleGreenhouse(prev));
  };

  const handleTogglePowerSaving = () => {
    setState((prev) => toggleEmergencyPowerSaving(prev));
  };

  const handlePerformMedical = () => {
    setState((prev) => performMedicalTreatment(prev));
  };

  const handleConfirmReset = () => {
    const fresh = clearSimulationState();
    setState(fresh);
    setResetModalOpen(false);
    setCurrentTab('overview');
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col font-sans">
      {/* Top Application Bar */}
      <TopBar
        state={state}
        onResetClick={() => setResetModalOpen(true)}
        onMobileMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
      />

      {/* Main Workspace with Fixed Sidebar and Scrollable Content */}
      <div className="flex-1 flex">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          state={state}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentTab === 'overview' && (
            <MissionOverview
              state={state}
              onAdvanceDay={handleAdvanceDay}
              onSelectTab={setCurrentTab}
              onToggleWaterRecycling={handleToggleWaterRecycling}
              onToggleSolarOptimization={handleToggleSolarOptimization}
              onDeployAuxShielding={handleDeployAuxShielding}
              onToggleGreenhouse={handleToggleGreenhouse}
              onTogglePowerSaving={handleTogglePowerSaving}
              onPerformMedical={handlePerformMedical}
              onReset={() => setResetModalOpen(true)}
            />
          )}

          {currentTab === 'resources' && (
            <ResourceManagement
              state={state}
              onToggleWaterRecycling={handleToggleWaterRecycling}
              onToggleSolarOptimization={handleToggleSolarOptimization}
              onDeployAuxShielding={handleDeployAuxShielding}
              onToggleGreenhouse={handleToggleGreenhouse}
              onTogglePowerSaving={handleTogglePowerSaving}
              onPerformMedical={handlePerformMedical}
            />
          )}

          {currentTab === 'crew' && (
            <CrewHealth
              state={state}
              onPerformMedical={handlePerformMedical}
            />
          )}

          {currentTab === 'habitat' && (
            <HabitatSystems
              state={state}
              onToggleWaterRecycling={handleToggleWaterRecycling}
              onToggleSolarOptimization={handleToggleSolarOptimization}
              onDeployAuxShielding={handleDeployAuxShielding}
              onToggleGreenhouse={handleToggleGreenhouse}
              onTogglePowerSaving={handleTogglePowerSaving}
            />
          )}

          {currentTab === 'logs' && <MissionLog logs={state.logs} />}

          {currentTab === 'about' && <AboutMission />}
        </main>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={resetModalOpen}
        title="Reset Artemis Outpost Mission?"
        description="This will erase all recorded daily telemetry, clear your simulation progress, and restore initial Day 1 parameters (4 astronauts, default ECLSS reserves). This action cannot be undone."
        confirmLabel="Reset Mission"
        cancelLabel="Continue Simulation"
        isDestructive={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setResetModalOpen(false)}
      />

      {/* Day Advance Debriefing Modal */}
      <DayAdvanceModal
        isOpen={advanceModalData.isOpen}
        onClose={() =>
          setAdvanceModalData((prev) => ({ ...prev, isOpen: false }))
        }
        day={advanceModalData.day}
        deltas={advanceModalData.deltas}
        events={advanceModalData.events}
        state={state}
      />
    </div>
  );
};

export default App;
