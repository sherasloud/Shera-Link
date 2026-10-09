import React, { useState } from 'react';
import { VillageNode, ConnectedDevice } from '../types';
import {
  Wifi,
  Search,
  Radio,
  Sliders,
  RotateCw,
  Zap,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Maximize2,
} from 'lucide-react';

interface VillageMeshMapViewProps {
  nodes: VillageNode[];
  onUpdateNodeQoS: (nodeId: string, priority: 'critical' | 'high' | 'standard') => void;
  onRebootNode: (nodeId: string) => void;
}

export const VillageMeshMapView: React.FC<VillageMeshMapViewProps> = ({
  nodes,
  onUpdateNodeQoS,
  onRebootNode,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-clinic');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const filteredNodes = nodes.filter((node) => {
    const matchesCategory =
      filterCategory === 'all' ||
      (filterCategory === 'priority' && (node.qosPriority === 'critical' || node.qosPriority === 'high')) ||
      node.category === filterCategory;
    const matchesSearch =
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.activeDevices.some((d) => d.deviceName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const centralNode = nodes.find((n) => n.id === 'node-central-mast') || nodes[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-cyan-950/90 border border-cyan-500/50 text-cyan-200 px-4 py-3 rounded-lg flex items-center justify-between text-sm shadow-lg shadow-cyan-950/60">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-xs text-cyan-300 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Village Mesh Distribution & Topology Map
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            5.8 GHz PtMP Wireless Backhauls connecting 6 remote village clusters to the central Starlink dish
          </p>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search node or device..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-44 sm:w-52"
            />
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                filterCategory === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Nodes
            </button>
            <button
              onClick={() => setFilterCategory('priority')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                filterCategory === 'priority'
                  ? 'bg-slate-800 text-cyan-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              High QoS
            </button>
            <button
              onClick={() => setFilterCategory('school')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                filterCategory === 'school'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              School
            </button>
            <button
              onClick={() => setFilterCategory('clinic')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                filterCategory === 'clinic'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Clinic
            </button>
            <button
              onClick={() => setFilterCategory('bazaar')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                filterCategory === 'bazaar'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bazaar
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map (Left) + Selected Node Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: High-Definition Vector Village Map */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 overflow-hidden">
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Char Meghna Geographic Sector</span>
              <span className="text-slate-500 font-mono">· Coverage Radius: 2.2 km</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" /> Central Gateway
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Active Node
              </span>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative aspect-[4/3] w-full bg-slate-950 rounded-lg border border-slate-800/80 overflow-hidden select-none">
            {/* SVG Terrain & Rivers Backdrop */}
            <svg viewBox="0 0 500 375" className="w-full h-full">
              <defs>
                <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
                  <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
                {/* Microwave pulse animation */}
                <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Grid Background */}
              <rect width="500" height="375" fill="url(#grid)" />

              {/* Meghna River Curved Contour on the East */}
              <path
                d="M 410 0 C 420 80, 440 140, 460 210 C 480 270, 470 330, 490 375 L 500 375 L 500 0 Z"
                fill="#0f2942"
                opacity="0.6"
              />
              <text x="475" y="100" fill="#0284c7" fontSize="10" fontFamily="monospace" transform="rotate(75, 475, 100)" opacity="0.7">
                MEGHNA RIVER ESTUARY
              </text>

              {/* Village Green Fields & Homestead Patches */}
              <path
                d="M 40 40 Q 120 20 200 60 Q 220 120 140 160 Q 60 140 40 40 Z"
                fill="#064e3b"
                opacity="0.15"
              />
              <path
                d="M 280 180 Q 380 160 410 240 Q 360 320 280 300 Q 240 240 280 180 Z"
                fill="#064e3b"
                opacity="0.15"
              />
              <path
                d="M 80 220 Q 180 240 160 340 Q 60 350 40 280 Q 60 230 80 220 Z"
                fill="#064e3b"
                opacity="0.15"
              />

              {/* Coverage Circle around Central Tower */}
              <circle
                cx="250"
                cy="187.5"
                r="165"
                fill="none"
                stroke="#0891b2"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.3"
              />
              <circle
                cx="250"
                cy="187.5"
                r="95"
                fill="none"
                stroke="#0891b2"
                strokeWidth="0.7"
                strokeDasharray="2,2"
                opacity="0.4"
              />

              {/* Microwave Link Lines from Central Mast to Each Node */}
              {nodes
                .filter((n) => n.id !== 'node-central-mast')
                .map((node) => {
                  const x1 = 250;
                  const y1 = 187.5;
                  const x2 = (node.coordinates.x / 100) * 500;
                  const y2 = (node.coordinates.y / 100) * 375;
                  const isSelected = selectedNodeId === node.id;

                  return (
                    <g key={`link-${node.id}`}>
                      {/* Connection Line */}
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={isSelected ? '#22d3ee' : '#0e7490'}
                        strokeWidth={isSelected ? '2' : '1.2'}
                        strokeDasharray={isSelected ? '5,3' : '3,3'}
                        opacity={isSelected ? 1 : 0.6}
                      />
                      {/* Midpoint packet pulse */}
                      <circle
                        cx={(x1 + x2) / 2}
                        cy={(y1 + y2) / 2}
                        r="2.5"
                        fill="#38bdf8"
                        opacity={0.8}
                      />
                    </g>
                  );
                })}

              {/* Central Starlink Tower Node */}
              <g transform="translate(250, 187.5)" className="cursor-pointer" onClick={() => setSelectedNodeId('node-central-mast')}>
                <circle r="22" fill="#06b6d4" opacity="0.15" className="animate-ping" />
                <circle r="14" fill="#0891b2" stroke="#22d3ee" strokeWidth="2" />
                <circle r="5" fill="#ffffff" />
                <text x="0" y="24" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  CENTRAL STARLINK MAST
                </text>
                <text x="0" y="34" fill="#67e8f9" fontSize="8" textAnchor="middle" fontFamily="monospace">
                  Gateway 450 Mbps
                </text>
              </g>

              {/* Village Nodes on the Map */}
              {nodes
                .filter((n) => n.id !== 'node-central-mast')
                .map((node) => {
                  const cx = (node.coordinates.x / 100) * 500;
                  const cy = (node.coordinates.y / 100) * 375;
                  const isSelected = selectedNodeId === node.id;

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${cx}, ${cy})`}
                      className="cursor-pointer transition-transform"
                      onClick={() => setSelectedNodeId(node.id)}
                    >
                      {/* Highlight circle if selected */}
                      {isSelected && (
                        <circle
                          r="18"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2"
                          strokeDasharray="3,3"
                        />
                      )}
                      {/* Node circle */}
                      <circle
                        r="10"
                        fill={node.qosPriority === 'critical' ? '#0284c7' : '#1e293b'}
                        stroke={node.qosPriority === 'critical' ? '#38bdf8' : '#10b981'}
                        strokeWidth="2"
                      />
                      <circle r="4" fill={node.qosPriority === 'critical' ? '#38bdf8' : '#10b981'} />

                      {/* Label badge */}
                      <rect
                        x="-45"
                        y="14"
                        width="90"
                        height="18"
                        rx="4"
                        fill="#090d16"
                        stroke={isSelected ? '#38bdf8' : '#334155'}
                        strokeWidth="1"
                        opacity="0.9"
                      />
                      <text
                        x="0"
                        y="26"
                        fill={isSelected ? '#38bdf8' : '#f1f5f9'}
                        fontSize="8.5"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        {node.name.split(' ')[0]} {node.name.split(' ')[1] || ''}
                      </text>
                    </g>
                  );
                })}
            </svg>

            {/* Map corner badge */}
            <div className="absolute top-2 left-2 bg-slate-900/90 border border-slate-800 rounded px-2.5 py-1 text-[11px] font-mono text-slate-300">
              Char Sonapur · 6 PtMP Relays · 210 Connected Villagers
            </div>
          </div>

          {/* Node Quick Selector Carousel */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`px-3 py-2 rounded-lg text-left whitespace-nowrap shrink-0 transition-colors border ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500/50 text-white'
                      : 'bg-slate-950/80 border-slate-800/80 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="text-xs font-semibold">{node.name.split(' ')[0]} {node.name.split(' ')[1] || ''}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {node.currentDownloadMbps} Mbps · {node.connectedDevicesCount} devs
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Node Telemetry & Connected Devices Inspector */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          {/* Node Header */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <span>{selectedNode.radioFrequency}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedNode.distanceMeters}m from Central Mast</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {selectedNode.name}
              </h2>
              <div className="text-xs text-slate-400 mt-0.5">
                {selectedNode.bengaliName}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedNode.location}</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded bg-emerald-950/60 border border-emerald-800/50 text-emerald-400">
                {selectedNode.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Node Live Throughput Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Downlink Rate</span>
              <div className="text-xl font-bold font-mono text-white">
                {selectedNode.currentDownloadMbps}{' '}
                <span className="text-xs text-slate-400">Mbps</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Cap: {selectedNode.maxBandwidthMbps} Mbps
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Signal Quality (RSSI)</span>
              <div className="text-xl font-bold font-mono text-cyan-400">
                {selectedNode.signalRssiDbm}{' '}
                <span className="text-xs text-slate-400">dBm</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">
                Strong Line-of-Sight
              </span>
            </div>
          </div>

          {/* QoS Priority Selector (Critical function) */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                QoS Traffic Priority Allocation
              </span>
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                Current: {selectedNode.qosPriority}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['standard', 'high', 'critical'] as const).map((p) => {
                const isActive = selectedNode.qosPriority === p;
                return (
                  <button
                    key={p}
                    onClick={() => {
                      onUpdateNodeQoS(selectedNode.id, p);
                      showToast(
                        `QoS priority for ${selectedNode.name} updated to ${p.toUpperCase()}.`
                      );
                    }}
                    className={`py-1.5 px-2 text-xs font-medium rounded capitalize border transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-600 font-semibold shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Critical priority guarantees uninterrupted bandwidth during medical video consults or online exams.
            </p>
          </div>

          {/* Connected Devices Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                Connected Client Devices ({selectedNode.connectedDevicesCount} active)
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Sample Devices</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {selectedNode.activeDevices.map((dev) => (
                <div
                  key={dev.id}
                  className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span>{dev.deviceName}</span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1 rounded">
                        {dev.userType}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {dev.ipAddress} · {dev.voucherPlan}
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-slate-200 block text-[11px]">
                      {Math.round(dev.downloadRateKbps / 1024 * 10) / 10} Mbps
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      {dev.signalDbm} dBm
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Node Action Buttons */}
          <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2">
            <button
              onClick={() => {
                onRebootNode(selectedNode.id);
                showToast(`Soft reboot command dispatched to ${selectedNode.name} airMAX AP.`);
              }}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reboot AP Radio</span>
            </button>

            <button
              onClick={() => {
                showToast(`RF 5.8 GHz spectrum scan initiated on channel 149 (5745 MHz). Noise floor: -96 dBm.`);
              }}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>RF Spectrum Scan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
