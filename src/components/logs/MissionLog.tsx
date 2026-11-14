import React, { useState } from 'react';
import {
  FileText,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Radio,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { MissionLogEntry, LogCategory } from '../../types/simulation';

interface MissionLogProps {
  logs: MissionLogEntry[];
}

export const MissionLog: React.FC<MissionLogProps> = ({ logs }) => {
  const [filter, setFilter] = useState<LogCategory | 'all'>('all');

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.category === filter;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `outpost_mission_logs_sol_${logs[0]?.day || 1}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getSeverityBadge = (severity: MissionLogEntry['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold uppercase">
            Critical
          </span>
        );
      case 'warning':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold uppercase">
            Warning
          </span>
        );
      case 'success':
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold uppercase">
            Success
          </span>
        );
      case 'info':
      default:
        return (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 uppercase">
            Routine
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#0b1329] border border-slate-800 rounded p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold mb-1">
            Historical Audit Trail
          </div>
          <h1 className="text-xl font-bold font-mono text-white tracking-tight">
            Outpost Mission Telemetry & Operations Log
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Chronological log of day transitions, commander orders, space weather events, and ECLSS alerts.
          </p>
        </div>

        <button
          onClick={handleExportJson}
          className="px-3.5 py-2 text-xs font-mono font-medium rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-2 self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Mission Telemetry (.json)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 p-2 rounded border border-slate-800">
        <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 px-2">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>

        {[
          { id: 'all', label: 'All Records' },
          { id: 'system', label: 'Daily Reports' },
          { id: 'action', label: 'Commander Decisions' },
          { id: 'incident', label: 'Lunar Incidents' },
          { id: 'alert', label: 'Alarms' },
          { id: 'crew', label: 'Crew Medical' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as LogCategory | 'all')}
            className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
              filter === f.id
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
            }`}
          >
            {f.label}
          </button>
        ))}

        <div className="ml-auto text-xs font-mono text-slate-400 px-2">
          Showing {filteredLogs.length} of {logs.length} entries
        </div>
      </div>

      {/* Log Feed */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="bg-[#0b1329] border border-slate-800 rounded p-8 text-center text-xs font-mono text-slate-400">
            No events match the selected filter.
          </div>
        ) : (
          filteredLogs.map((entry) => (
            <div
              key={entry.id}
              className={`bg-[#0b1329] border rounded p-4 transition-colors ${
                entry.severity === 'critical'
                  ? 'border-rose-900/60 bg-rose-950/15'
                  : entry.severity === 'warning'
                  ? 'border-amber-900/50 bg-amber-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white">
                    {entry.title}
                  </span>
                  {getSeverityBadge(entry.severity)}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{entry.timestamp}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {entry.details}
              </p>

              {entry.resourceImpact && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap gap-3 font-mono text-[11px] text-slate-400">
                  {entry.resourceImpact.oxygen !== undefined && (
                    <span>
                      O₂:{' '}
                      <span className={entry.resourceImpact.oxygen >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {entry.resourceImpact.oxygen >= 0 ? '+' : ''}
                        {entry.resourceImpact.oxygen.toFixed(1)}%
                      </span>
                    </span>
                  )}
                  {entry.resourceImpact.water !== undefined && (
                    <span>
                      H₂O:{' '}
                      <span className={entry.resourceImpact.water >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {entry.resourceImpact.water >= 0 ? '+' : ''}
                        {entry.resourceImpact.water.toFixed(1)}%
                      </span>
                    </span>
                  )}
                  {entry.resourceImpact.food !== undefined && (
                    <span>
                      Food:{' '}
                      <span className={entry.resourceImpact.food >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {entry.resourceImpact.food >= 0 ? '+' : ''}
                        {entry.resourceImpact.food.toFixed(1)}%
                      </span>
                    </span>
                  )}
                  {entry.resourceImpact.energy !== undefined && (
                    <span>
                      Energy:{' '}
                      <span className={entry.resourceImpact.energy >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {entry.resourceImpact.energy >= 0 ? '+' : ''}
                        {entry.resourceImpact.energy.toFixed(1)}%
                      </span>
                    </span>
                  )}
                  {entry.resourceImpact.crewHealth !== undefined && (
                    <span>
                      Crew Health:{' '}
                      <span className={entry.resourceImpact.crewHealth >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {entry.resourceImpact.crewHealth >= 0 ? '+' : ''}
                        {entry.resourceImpact.crewHealth.toFixed(1)}%
                      </span>
                    </span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
