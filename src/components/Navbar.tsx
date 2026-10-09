import React from 'react';
import { NavigationTab } from '../types';
import { Activity, Gauge } from 'lucide-react';

interface NavbarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenSpeedTest: () => void;
  starlinkState: 'ONLINE' | 'SEARCHING' | 'DEGRADED' | 'STANDBY';
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenSpeedTest,
  starlinkState,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strict 3-zone Top Bar Contract: [Brand title, 1 line] - [4-5 nav links, 1-2 words, 1 line] - [1 primary action] */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('telemetry')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                    Shera Link
                  </span>
                  <span className="hidden sm:inline text-xs font-mono text-cyan-400/80">
                    Starlink Village
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium">
            <button
              onClick={() => onSelectTab('telemetry')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 text-sm ${
                activeTab === 'telemetry'
                  ? 'text-cyan-400 bg-cyan-950/50 border border-cyan-800/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Telemetry & Dish
            </button>
            <button
              onClick={() => onSelectTab('mesh_map')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 text-sm ${
                activeTab === 'mesh_map'
                  ? 'text-cyan-400 bg-cyan-950/50 border border-cyan-800/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Village Mesh Map
            </button>
            <button
              onClick={() => onSelectTab('vouchers')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 text-sm ${
                activeTab === 'vouchers'
                  ? 'text-cyan-400 bg-cyan-950/50 border border-cyan-800/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Micro-Vouchers
            </button>
            <button
              onClick={() => onSelectTab('community')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 text-sm ${
                activeTab === 'community'
                  ? 'text-cyan-400 bg-cyan-950/50 border border-cyan-800/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Community Services
            </button>
            <button
              onClick={() => onSelectTab('ai_ops')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 text-sm ${
                activeTab === 'ai_ops'
                  ? 'text-cyan-400 bg-cyan-950/50 border border-cyan-800/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              AI Network Ops
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenSpeedTest}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm shadow-cyan-500/20 whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>Speed Test</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="md:hidden flex items-center gap-2 py-2 border-t border-slate-900 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onSelectTab('telemetry')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
              activeTab === 'telemetry' ? 'bg-cyan-950 text-cyan-300 font-medium' : 'text-slate-400'
            }`}
          >
            Dish Telemetry
          </button>
          <button
            onClick={() => onSelectTab('mesh_map')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
              activeTab === 'mesh_map' ? 'bg-cyan-950 text-cyan-300 font-medium' : 'text-slate-400'
            }`}
          >
            Mesh Map
          </button>
          <button
            onClick={() => onSelectTab('vouchers')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
              activeTab === 'vouchers' ? 'bg-cyan-950 text-cyan-300 font-medium' : 'text-slate-400'
            }`}
          >
            Vouchers
          </button>
          <button
            onClick={() => onSelectTab('community')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
              activeTab === 'community' ? 'bg-cyan-950 text-cyan-300 font-medium' : 'text-slate-400'
            }`}
          >
            Community Hub
          </button>
          <button
            onClick={() => onSelectTab('ai_ops')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded ${
              activeTab === 'ai_ops' ? 'bg-cyan-950 text-cyan-300 font-medium' : 'text-slate-400'
            }`}
          >
            AI Ops
          </button>
        </div>
      </div>
    </header>
  );
};
