import React from 'react';
import {
  LayoutDashboard,
  Gauge,
  Users,
  Cpu,
  FileText,
  Info,
  X,
  AlertCircle,
} from 'lucide-react';
import { MissionTab, SimulationState } from '../../types/simulation';

interface SidebarProps {
  currentTab: MissionTab;
  onSelectTab: (tab: MissionTab) => void;
  state: SimulationState;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  state,
  mobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'overview' as MissionTab,
      label: 'Mission Overview',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'resources' as MissionTab,
      label: 'Resource Management',
      icon: Gauge,
      badge: state.overallStatus === 'critical' ? 'CRIT' : undefined,
    },
    {
      id: 'crew' as MissionTab,
      label: 'Crew Health',
      icon: Users,
      badge: `${state.crew.filter((c) => c.status === 'Nominal').length}/4`,
    },
    {
      id: 'habitat' as MissionTab,
      label: 'Habitat Systems',
      icon: Cpu,
      badge: `${state.systems.filter((s) => s.operational).length}/5`,
    },
    {
      id: 'logs' as MissionTab,
      label: 'Mission Log',
      icon: FileText,
      badge: state.logs.length.toString(),
    },
    {
      id: 'about' as MissionTab,
      label: 'About the Mission',
      icon: Info,
      badge: undefined,
    },
  ];

  const content = (
    <div className="h-full flex flex-col justify-between p-4 bg-[#080d1a] border-r border-slate-800">
      <div>
        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="font-mono text-sm font-bold text-white tracking-wider">
            OUTPOST NAVIGATION
          </div>
          <button
            onClick={onCloseMobile}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section title */}
        <div className="hidden md:block text-[11px] font-mono uppercase tracking-wider text-slate-400 px-3 mb-3">
          Command Modules
        </div>

        {/* Navigation buttons */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-mono font-medium transition-all text-left ${
                  isActive
                    ? 'bg-slate-800/90 text-cyan-400 border border-slate-700/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      item.badge === 'CRIT'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : isActive
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Outpost Telemetry Mini Card in Sidebar */}
      <div className="pt-4 border-t border-slate-800 text-slate-400 font-mono text-[11px] space-y-2">
        <div className="flex justify-between items-center text-slate-400">
          <span>OUTPOST TELEMETRY</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800 space-y-1.5">
          <div className="flex justify-between text-slate-400">
            <span>Site:</span>
            <span className="text-slate-200">Shackleton Rim</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Coordinates:</span>
            <span className="text-slate-200">89.9°S 0.0°E</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Crew Roster:</span>
            <span className="text-slate-200">4 Astronauts</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>ECLSS Loop:</span>
            <span className="text-emerald-400">Active Closed</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-400 text-center pt-1">
          NASA Space Apps Challenge 2026
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black/70 backdrop-blur-xs">
          <div className="w-72 h-full">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
