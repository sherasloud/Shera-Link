import React, { useState, useEffect } from 'react';
import { StarlinkTelemetry, PowerTelemetry } from '../types';
import {
  Radio,
  Sun,
  BatteryCharging,
  Wifi,
  Compass,
  Zap,
  RotateCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import towerImg from '../assets/images/village_starlink_tower_1791566568647.jpg';

interface TelemetryViewProps {
  telemetry: StarlinkTelemetry;
  power: PowerTelemetry;
  onRefreshTelemetry: () => void;
  onAlignDish: () => void;
  onToggleHeater: () => void;
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({
  telemetry,
  power,
  onRefreshTelemetry,
  onAlignDish,
  onToggleHeater,
}) => {
  // Live animated telemetry fluctuations
  const [liveDownlink, setLiveDownlink] = useState(telemetry.downlinkCurrentMbps);
  const [liveUplink, setLiveUplink] = useState(telemetry.uplinkCurrentMbps);
  const [livePing, setLivePing] = useState(telemetry.pingMs);
  const [nextHandoffSec, setNextHandoffSec] = useState(142);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Fluctuating real-time telemetry stream
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveDownlink((prev) => {
        const delta = (Math.random() - 0.48) * 8;
        return Number(Math.max(180, Math.min(295, prev + delta)).toFixed(1));
      });
      setLiveUplink((prev) => {
        const delta = (Math.random() - 0.5) * 2;
        return Number(Math.max(28, Math.min(48, prev + delta)).toFixed(1));
      });
      setLivePing((prev) => {
        const delta = (Math.random() - 0.5) * 3;
        return Math.max(22, Math.min(38, Math.round(prev + delta)));
      });
      setNextHandoffSec((prev) => (prev > 1 ? prev - 1 : 180));
    }, 1800);

    return () => clearInterval(timer);
  }, []);

  const handleActionClick = (msg: string, callback?: () => void) => {
    setActionNotice(msg);
    if (callback) callback();
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 px-4 py-3 rounded-lg flex items-center justify-between text-sm shadow-lg shadow-cyan-950/50">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-xs text-cyan-300 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hero Visual Section: Starlink Dish atop Village Mast */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Hero Context */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
                <span>TERMINAL STATUS: {telemetry.terminalState}</span>
                <span aria-hidden="true">·</span>
                <span>BEAM LOCKED: {telemetry.satelliteId}</span>
                <span aria-hidden="true">·</span>
                <span>BAND: Ku/Ka 12.45 GHz</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3 text-balance">
                Char Sonapur Central Starlink Gateway
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                High-performance satellite terminal mounted on the 32-meter village lattice tower,
                supplying primary Gigabit-ready backhaul to 6 rural village clusters, 240+ households,
                the union high school, and community clinic.
              </p>
            </div>

            {/* Quick Terminal Meta & Controls */}
            <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="block text-xs text-slate-400">Azimuth / Tilt</span>
                <span className="text-base font-semibold text-white font-mono tabular-nums">
                  {telemetry.azimuthDeg}° SE / {telemetry.elevationDeg}°
                </span>
              </div>
              <div>
                <span className="block text-xs text-slate-400">Sky Obstruction</span>
                <span className="text-base font-semibold text-emerald-400 font-mono tabular-nums">
                  {telemetry.obstructionPercent}% (Clear)
                </span>
              </div>
              <div>
                <span className="block text-xs text-slate-400">Next LEO Handoff</span>
                <span className="text-base font-semibold text-cyan-300 font-mono tabular-nums">
                  in {Math.floor(nextHandoffSec / 60)}m {nextHandoffSec % 60}s
                </span>
              </div>
              <div>
                <span className="block text-xs text-slate-400">Dish Thermal</span>
                <span className="text-base font-semibold text-white font-mono tabular-nums">
                  34.2°C (Idle)
                </span>
              </div>
            </div>

            {/* Terminal Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() =>
                  handleActionClick(
                    'Re-aligning phased array electronically with Starlink constellation...',
                    onAlignDish
                  )
                }
                className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>Calibrate Phased Array</span>
              </button>
              <button
                onClick={() =>
                  handleActionClick('Starlink terminal snow/rain heater mode toggled.', onToggleHeater)
                }
                className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Heater: {telemetry.heaterStatus}</span>
              </button>
              <button
                onClick={() =>
                  handleActionClick('Running RF noise spectrum & SNR diagnostics...', onRefreshTelemetry)
                }
                className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                <span>Refresh Diagnostics</span>
              </button>
            </div>
          </div>

          {/* Right Image Container */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
            <img
              src={towerImg}
              alt="Starlink satellite antenna mast overlooking Char Sonapur village"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded border border-slate-800 text-[11px] font-mono text-slate-300">
              Tower Mast: 32m · 22.84° N, 91.09° E
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Downlink */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70">
          <span className="text-xs text-slate-400 block mb-1">Downlink Speed</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              {liveDownlink}
            </span>
            <span className="text-xs text-slate-400">Mbps</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            Peak: {telemetry.downlinkPeakMbps} Mbps
          </span>
        </div>

        {/* Uplink */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70">
          <span className="text-xs text-slate-400 block mb-1">Uplink Speed</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-cyan-400">
              {liveUplink}
            </span>
            <span className="text-xs text-slate-400">Mbps</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            Peak: {telemetry.uplinkPeakMbps} Mbps
          </span>
        </div>

        {/* Latency / Ping */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70">
          <span className="text-xs text-slate-400 block mb-1">LEO Latency</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              {livePing}
            </span>
            <span className="text-xs text-slate-400">ms</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            Jitter: {telemetry.jitterMs} ms · Loss: {telemetry.packetLossPercent}%
          </span>
        </div>

        {/* SNR Signal Quality */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70">
          <span className="text-xs text-slate-400 block mb-1">Signal SNR</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
              {telemetry.snrDb}
            </span>
            <span className="text-xs text-slate-400">dB</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            Optimal (12-15 dB threshold)
          </span>
        </div>

        {/* Solar Generation */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70">
          <span className="text-xs text-slate-400 block mb-1">Solar Microgrid</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-400">
              {power.solarGenerationWatts}
            </span>
            <span className="text-xs text-slate-400">W</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            Harvest: {power.solarDailyHarvestKwh} kWh today
          </span>
        </div>

        {/* Battery SOC */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/70">
          <span className="text-xs text-slate-400 block mb-1">LiFePO4 Backup</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
              {power.batterySocPercent}%
            </span>
            <span className="text-xs text-slate-400">SOC</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            Est. {power.batteryRuntimeHours}h autonomy
          </span>
        </div>
      </div>

      {/* Deep Telemetry Columns: Satellite Sky Dome + Solar Power Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 360° Starlink Sky Radar & Constellation Tracker */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">
                Starlink LEO Constellation Sky Dome
              </h2>
              <p className="text-xs text-slate-400">
                Live polar view showing 8 satellites currently in line-of-sight window
              </p>
            </div>
            <div className="text-right font-mono text-xs text-cyan-400">
              Active: {telemetry.satelliteId}
            </div>
          </div>

          {/* Sky Radar Polar Canvas */}
          <div className="relative aspect-video max-h-[320px] w-full bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* Radial Elevation Rings */}
              <circle cx="200" cy="150" r="120" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
              <circle cx="200" cy="150" r="80" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
              <circle cx="200" cy="150" r="40" fill="none" stroke="#1e293b" strokeWidth="1" />
              
              {/* Polar Compass Axes */}
              <line x1="200" y1="25" x2="200" y2="275" stroke="#1e293b" strokeWidth="1" />
              <line x1="75" y1="150" x2="325" y2="150" stroke="#1e293b" strokeWidth="1" />
              
              {/* Cardinal Labels */}
              <text x="200" y="20" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">N 0°</text>
              <text x="335" y="153" fill="#64748b" fontSize="10" textAnchor="start" fontFamily="monospace">E 90°</text>
              <text x="200" y="290" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">S 180°</text>
              <text x="65" y="153" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">W 270°</text>
              <text x="200" y="145" fill="#475569" fontSize="9" textAnchor="middle" fontFamily="monospace">Zenith 90°</text>

              {/* Antenna Aim Direction Cone */}
              <path
                d="M 200 150 L 235 90 A 65 65 0 0 1 270 125 Z"
                fill="rgba(6, 182, 212, 0.12)"
                stroke="rgba(6, 182, 212, 0.4)"
                strokeWidth="1"
              />

              {/* Active Beam Locked Satellite */}
              <g transform="translate(242, 105)">
                <circle r="6" fill="#06b6d4" className="animate-pulse" />
                <circle r="12" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.6" />
                <text x="10" y="3" fill="#67e8f9" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  {telemetry.satelliteId} (ACTIVE)
                </text>
                <text x="10" y="15" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                  El: 64° · Az: 148° · Doppler: -14 kHz
                </text>
              </g>

              {/* Background Orbiting Starlink Satellites in Sky Dome */}
              <g transform="translate(130, 85)">
                <circle r="3.5" fill="#64748b" />
                <text x="7" y="3" fill="#64748b" fontSize="8" fontFamily="monospace">STARLINK-31904</text>
              </g>
              <g transform="translate(160, 215)">
                <circle r="3.5" fill="#64748b" />
                <text x="7" y="3" fill="#64748b" fontSize="8" fontFamily="monospace">STARLINK-30219</text>
              </g>
              <g transform="translate(280, 200)">
                <circle r="3.5" fill="#64748b" />
                <text x="7" y="3" fill="#64748b" fontSize="8" fontFamily="monospace">STARLINK-32115</text>
              </g>
              <g transform="translate(100, 160)">
                <circle r="3.5" fill="#64748b" />
                <text x="7" y="3" fill="#64748b" fontSize="8" fontFamily="monospace">STARLINK-29841</text>
              </g>
              <g transform="translate(255, 60)">
                <circle r="3.5" fill="#64748b" />
                <text x="7" y="3" fill="#64748b" fontSize="8" fontFamily="monospace">STARLINK-33044</text>
              </g>
            </svg>

            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-400 bg-slate-900/90 px-2 py-1 rounded border border-slate-800">
              Sky Visibility: 100% · Obstruction: 0.1% (Zero trees blocking phased array)
            </div>
          </div>

          {/* Telemetry Specification Table */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 block">Antenna Hardware</span>
              <span className="font-mono text-white text-[11px] truncate block">
                {telemetry.dishModel}
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 block">IP Gateway</span>
              <span className="font-mono text-cyan-300 text-[11px] truncate block">
                {telemetry.ipAddress}
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80">
              <span className="text-slate-400 block">System Uptime</span>
              <span className="font-mono text-white text-[11px]">
                {Math.floor(telemetry.uptimeSeconds / 86400)}d{' '}
                {Math.floor((telemetry.uptimeSeconds % 86400) / 3600)}h continuous
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Solar & Battery Microgrid System */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Solar & Battery Microgrid
                </h2>
                <p className="text-xs text-slate-400">
                  Self-sustaining 24/7 power for Starlink & 6 distribution radios
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                <BatteryCharging className="w-3.5 h-3.5" />
                <span>SURPLUS +1,695W</span>
              </div>
            </div>

            {/* Microgrid Power Flow Diagram */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-4">
              {/* Solar Array Node */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-white block">
                      3.2 kW Monocrystalline Array
                    </span>
                    <span className="text-[11px] text-slate-400">
                      8x 400W Panels on Union Parishad Roof
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-amber-400">
                    {power.solarGenerationWatts} W
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Efficiency: {power.mpptEfficiencyPercent}%
                  </span>
                </div>
              </div>

              {/* Power Flow Arrow */}
              <div className="flex items-center justify-center text-slate-600">
                <span className="text-[11px] font-mono text-slate-400">
                  ↓ MPPT Charge Controller (52.4V DC)
                </span>
              </div>

              {/* LiFePO4 Battery Bank */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <BatteryCharging className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-white block">
                      48V 100Ah LiFePO4 Storage
                    </span>
                    <span className="text-[11px] text-slate-400">
                      5.1 kWh Capacity · Cell Temp: {power.batteryTempCelsius}°C
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-emerald-400">
                    {power.batterySocPercent}% SOC
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {power.batteryVoltageVolts} V DC
                  </span>
                </div>
              </div>

              {/* Power Flow Arrow */}
              <div className="flex items-center justify-center text-slate-600">
                <span className="text-[11px] font-mono text-slate-400">
                  ↓ Pure Sine Wave Inverter
                </span>
              </div>

              {/* Critical Network Loads */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-white block">
                      Starlink Dish + 6x PtMP Base Radios
                    </span>
                    <span className="text-[11px] text-slate-400">
                      MikroTik RouterBOARD & Edge Cache Server
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-cyan-400">
                    {power.totalSystemLoadWatts} W
                  </span>
                  <span className="text-[11px] text-slate-500 block">Current Draw</span>
                </div>
              </div>
            </div>

            {/* Battery Backup Autonomy Bar */}
            <div className="mt-4 p-3 rounded bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300">Off-Grid Night Runtime Capacity</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  {power.batteryRuntimeHours} Hours Remaining
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${power.batterySocPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Even during 2 consecutive days of heavy monsoon downpour, the solar storage maintains
                unbroken internet connectivity for the clinic and school.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Generator Standby: Auto-start on &lt; 20% SOC</span>
            <span className="text-emerald-400 font-mono">READY</span>
          </div>
        </div>
      </div>
    </div>
  );
};
