import React, { useState } from 'react';
import {
  TelemedicineConsult,
  AgriculturalCropPrice,
  OfflineCacheItem,
  NoticeItem,
} from '../types';
import {
  HeartPulse,
  Sprout,
  BookOpen,
  Bell,
  Video,
  Mic,
  MicOff,
  PhoneOff,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileText,
  UserCheck,
} from 'lucide-react';
import hubImg from '../assets/images/community_wifi_hub_1791566582596.jpg';

interface CommunityServicesViewProps {
  consults: TelemedicineConsult[];
  cropPrices: AgriculturalCropPrice[];
  cacheItems: OfflineCacheItem[];
  notices: NoticeItem[];
}

export const CommunityServicesView: React.FC<CommunityServicesViewProps> = ({
  consults,
  cropPrices,
  cacheItems,
  notices,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'telemedicine' | 'krishi' | 'eschool' | 'notices'>('telemedicine');
  const [activeCallConsult, setActiveCallConsult] = useState<TelemedicineConsult | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [downloadedCache, setDownloadedCache] = useState<Record<string, boolean>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadOfflineItem = (item: OfflineCacheItem) => {
    setDownloadedCache((prev) => ({ ...prev, [item.id]: true }));
    showToast(`Streaming ${item.title} at 120 Mbps directly from Village Local Cache (0 satellite data used)!`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast */}
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

      {/* Community Banner with Generated Image */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-cyan-400 mb-2">
                RURAL DIGITAL EMPOWERMENT · ZERO BANDWIDTH BARRIERS
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                Shera Link Digital Community Lifeline
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                High-speed Starlink broadband powers telemedicine with district civil hospitals,
                transparent daily crop market prices for farmers, and local caching for student e-learning.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-3 gap-4">
              <div>
                <span className="block text-xs text-slate-400">Telemed Consults</span>
                <span className="text-base font-semibold text-white font-mono">
                  148 this month
                </span>
              </div>
              <div>
                <span className="block text-xs text-slate-400">Offline E-School</span>
                <span className="text-base font-semibold text-emerald-400 font-mono">
                  5,820 downloads
                </span>
              </div>
              <div>
                <span className="block text-xs text-slate-400">Local Cache Speed</span>
                <span className="text-base font-semibold text-cyan-400 font-mono">
                  120+ Mbps (0 Latency)
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full">
            <img
              src={hubImg}
              alt="Rural students and villagers utilizing the solar-powered community WiFi station"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded border border-slate-800 text-[11px] font-mono text-slate-300">
              Solar WiFi Station · Sonapur Hub
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('telemedicine')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'telemedicine'
              ? 'bg-slate-800 text-cyan-400 border border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <HeartPulse className="w-3.5 h-3.5" />
          <span>Telemedicine & Clinic</span>
        </button>

        <button
          onClick={() => setActiveSubTab('krishi')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'krishi'
              ? 'bg-slate-800 text-cyan-400 border border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sprout className="w-3.5 h-3.5" />
          <span>Krishi & Haat Prices</span>
        </button>

        <button
          onClick={() => setActiveSubTab('eschool')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'eschool'
              ? 'bg-slate-800 text-cyan-400 border border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Village Offline E-School</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notices')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'notices'
              ? 'bg-slate-800 text-cyan-400 border border-slate-700'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Union Noticeboard</span>
        </button>
      </div>

      {/* Tab 1: Telemedicine Consultation */}
      {activeSubTab === 'telemedicine' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">
                Paschim Para Clinic Telemedicine Queue
              </h2>
              <p className="text-xs text-slate-400">
                Direct low-latency Starlink video channel with Noakhali District Hospital Specialists
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/40">
              QoS Priority: CRITICAL (Guaranteed 15 Mbps Video Stream)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {consults.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono text-slate-400">{c.scheduledTime}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        c.status === 'in_call'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50'
                          : c.status === 'waiting'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {c.status === 'in_call' ? 'LIVE CONSULT' : c.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">
                    {c.patientName} ({c.age}y, {c.gender})
                  </h3>
                  <div className="text-xs text-slate-400">{c.villagePara}</div>

                  <div className="mt-3 p-2.5 rounded bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="text-cyan-400 font-medium">{c.doctorName}</div>
                    <div className="text-[11px] text-slate-400">{c.specialty} · {c.hospital}</div>
                  </div>

                  {/* Vitals */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                    <div className="p-1.5 rounded bg-slate-950 border border-slate-800/60">
                      <span className="text-slate-500 block">BP:</span> {c.vitals.bp}
                    </div>
                    <div className="p-1.5 rounded bg-slate-950 border border-slate-800/60">
                      <span className="text-slate-500 block">O2 Sat:</span> {c.vitals.oxygenSat}%
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mt-2.5 line-clamp-2">
                    {c.notes}
                  </p>
                </div>

                <button
                  onClick={() => setActiveCallConsult(c)}
                  className="w-full py-2 text-xs font-semibold bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join HD Consultation</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Krishi Samity & Commodity Prices */}
      {activeSubTab === 'krishi' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">
                Live Daily Crop Wholesale Market Rates
              </h2>
              <p className="text-xs text-slate-400">
                Updated at 06:00 AM every Haat market day to protect village farmers from middlemen price gouging
              </p>
            </div>
            <div className="text-xs font-mono text-cyan-400">
              Source: Sonapur Krishi Samity & DAE
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium">
                  <th className="py-3 px-4">Commodity / Crop</th>
                  <th className="py-3 px-4">Unit Measure</th>
                  <th className="py-3 px-4 text-right">Today's Village Haat</th>
                  <th className="py-3 px-4 text-right">Yesterday Rate</th>
                  <th className="py-3 px-4 text-right">Trend</th>
                  <th className="py-3 px-4 text-right">District Wholesale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {cropPrices.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      <div>{item.crop}</div>
                      <div className="text-[11px] text-slate-400">{item.bengaliCrop}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">{item.unit}</td>
                    <td className="py-3 px-4 text-right font-mono text-cyan-400 font-bold text-sm">
                      ৳ {item.todayHaatPriceBDT}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">
                      ৳ {item.yesterdayPriceBDT}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {item.trend === 'up' && (
                        <span className="text-emerald-400 font-mono inline-flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" /> +Up
                        </span>
                      )}
                      {item.trend === 'down' && (
                        <span className="text-rose-400 font-mono inline-flex items-center gap-1">
                          <TrendingDown className="w-3.5 h-3.5" /> -Down
                        </span>
                      )}
                      {item.trend === 'stable' && (
                        <span className="text-slate-400 font-mono inline-flex items-center gap-1">
                          <Minus className="w-3.5 h-3.5" /> Stable
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-200">
                      ৳ {item.districtCityPriceBDT}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Village Offline E-School */}
      {activeSubTab === 'eschool' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">
                Village Edge Server Offline E-School Repository
              </h2>
              <p className="text-xs text-slate-400">
                Local micro-server cache allows 100+ students to stream video courses simultaneously with 0 Starlink satellite quota used
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-400">
              Edge Storage: 1.8 TB SSD · Local LAN
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cacheItems.map((item) => {
              const isDownloaded = downloadedCache[item.id];
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                      <span>{item.category}</span>
                      <span>{item.sizeMb} MB</span>
                    </div>

                    <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
                      {item.title}
                    </h3>

                    <div className="text-xs text-slate-400 mt-2 font-mono">
                      Language: {item.language} · {item.downloadsCount} local students accessed
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadOfflineItem(item)}
                    className={`w-full py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      isDownloaded
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isDownloaded ? 'Streaming Locally at 120 Mbps' : 'Stream / Save Offline'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Union Notices */}
      {activeSubTab === 'notices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">
                Union Parishad Community Broadcasts & Weather Advisories
              </h2>
              <p className="text-xs text-slate-400">
                Official village announcements pushed to all connected mobile portals
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {notices.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                  n.urgency === 'high'
                    ? 'bg-slate-900 border-amber-900/60'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                    <span>{n.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{n.date}</span>
                    {n.urgency === 'high' && (
                      <span className="text-amber-400 font-semibold bg-amber-950 px-1.5 py-0.5 rounded text-[10px]">
                        URGENT
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {n.title}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {n.bengaliTitle}
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {n.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simulated Live Video Consult Modal */}
      {activeCallConsult && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            {/* Call Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400">
                  STARLINK LOW-LATENCY TELEMEDICINE LINK (28ms)
                </span>
                <h3 className="text-base font-bold text-white">
                  Consultation: {activeCallConsult.patientName} &amp; {activeCallConsult.doctorName}
                </h3>
              </div>
              <button
                onClick={() => setActiveCallConsult(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Video Canvas Simulation */}
            <div className="relative aspect-video bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden">
              <div className="text-center p-6 space-y-2">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 mx-auto flex items-center justify-center text-cyan-400 animate-pulse">
                  <HeartPulse className="w-8 h-8" />
                </div>
                <div className="text-white font-semibold text-sm">
                  {activeCallConsult.doctorName}
                </div>
                <div className="text-xs text-cyan-400 font-mono">
                  1080p 60fps · Audio Bitrate: 128 kbps Opus · 0.0% Packet Loss
                </div>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  &ldquo;Patient vitals received. Electrocardiogram telemetry via Starlink is stable. Recommending beta-blocker dosage adjustment.&rdquo;
                </p>
              </div>

              {/* Self view inset in corner */}
              <div className="absolute bottom-3 right-3 w-32 aspect-video bg-slate-900 border border-slate-700 rounded flex items-center justify-center text-[10px] text-slate-300">
                Clinic Camera (Local)
              </div>
            </div>

            {/* In-Call Controls */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full text-white cursor-pointer ${
                  isMuted ? 'bg-rose-600' : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-full text-white cursor-pointer ${
                  !isVideoOn ? 'bg-rose-600' : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <Video className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveCallConsult(null)}
                className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Teleconsult</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
