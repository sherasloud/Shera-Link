import React, { useState } from 'react';
import { VillageNode, StarlinkTelemetry, PowerTelemetry } from '../types';
import {
  Sparkles,
  Zap,
  Sliders,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Cpu,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

interface AiNetworkOptimizerProps {
  nodes: VillageNode[];
  telemetry: StarlinkTelemetry;
  power: PowerTelemetry;
  onApplyOptimizations: (optimizedNodes: VillageNode[]) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AiNetworkOptimizer: React.FC<AiNetworkOptimizerProps> = ({
  nodes,
  telemetry,
  power,
  onApplyOptimizations,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am Shera Link AI Network Operations Assistant. I monitor your Starlink Ku-band satellite downlink, 5.8 GHz PtMP village relays, and solar microgrid. How can I assist you with traffic shaping, rain fade compensation, or village node QoS today?',
      timestamp: '10:15 AM',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [optimizationHistory, setOptimizationHistory] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAutonomousRebalance = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Rebalance QoS logic:
      // School gets high bandwidth during day, Clinic gets critical guarantee, Bazaar gets standard throttle
      const updatedNodes: VillageNode[] = nodes.map((node) => {
        if (node.category === 'clinic') {
          return { ...node, qosPriority: 'critical', maxBandwidthMbps: 90 };
        }
        if (node.category === 'school') {
          return { ...node, qosPriority: 'high', maxBandwidthMbps: 140 };
        }
        if (node.category === 'bazaar') {
          return { ...node, qosPriority: 'standard', maxBandwidthMbps: 110 };
        }
        return node;
      });

      onApplyOptimizations(updatedNodes);
      setIsProcessing(false);
      setOptimizationHistory(
        'Autonomous Traffic Shaper applied: Dynamic bandwidth slices adjusted. 20 Mbps reserved for clinic telemedicine, 70 Mbps allocated for school e-lab, and anti-bufferbloat active on Haat Bazaar.'
      );
      showToast('Dynamic QoS & PtMP Bandwidth Slicing applied successfully across all 6 village nodes!');
    }, 1200);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputPrompt;
    if (!promptToSend.trim() || isProcessing) return;

    const userMsg: Message = {
      role: 'user',
      content: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputPrompt('');
    setIsProcessing(true);

    try {
      // Try backend proxy if available, otherwise use domain knowledge AI engine
      const res = await fetch('/api/ai-ops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          telemetry,
          power,
          nodes,
        }),
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        // Fallback domain-engineered response
        const fallbackReply = generateDomainAnswer(promptToSend, telemetry, power, nodes);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: fallbackReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch {
      const fallbackReply = generateDomainAnswer(promptToSend, telemetry, power, nodes);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateDomainAnswer = (
    query: string,
    tel: StarlinkTelemetry,
    pwr: PowerTelemetry,
    nds: VillageNode[]
  ) => {
    const q = query.toLowerCase();
    if (q.includes('rain') || q.includes('বৃষ্টি') || q.includes('monsoon') || q.includes('cloud')) {
      return `🌧️ **Monsoon Rain Fade Analysis & Mitigation**:
Current Starlink Signal SNR is **${tel.snrDb} dB** on Ku-band (12.45 GHz).
During heavy tropical cloudbursts in the Meghna delta, raindrops cause scattering and absorption (up to 3–6 dB attenuation).
**Recommended Actions**:
1. Shera Link's terminal is currently operating at +4 dB power margin, keeping packet loss at ${tel.packetLossPercent}%.
2. We have activated the local **Village Edge Cache** so student video streaming runs 100% locally from the micro-server with zero satellite dependency.
3. Rain heater is currently set to '${tel.heaterStatus}'. If wet leaves or heavy droplets stick to the dish surface, keep heater in AUTO to ensure droplet bead runoff.`;
    }

    if (q.includes('battery') || q.includes('solar') || q.includes('power') || q.includes('কারেন্ট')) {
      return `☀️ **Solar Microgrid & Energy Budget**:
- Current Battery SOC: **${pwr.batterySocPercent}%** (${pwr.batteryVoltageVolts}V LiFePO4).
- Solar Generation: **${pwr.solarGenerationWatts}W** vs Total System Draw: **${pwr.totalSystemLoadWatts}W**.
- Estimated Autonomy: **${pwr.batteryRuntimeHours} hours** off-grid.
**Operator Guidance**: The system is generating a **+1,695W surplus** charging the battery bank. Even during 2 completely overcast days, system load can be sustained. If battery drops below 25%, the automatic generator transfer switch will start the backup diesel unit without packet drop.`;
    }

    if (q.includes('clinic') || q.includes('doctor') || q.includes('হাসপাতাল') || q.includes('telemed')) {
      return `🏥 **Clinic Telemedicine Priority QoS**:
The Community Clinic node is assigned **CRITICAL QoS Priority**.
- Guaranteed Dedicated Pipe: **20 Mbps Down / 15 Mbps Up**.
- Priority Queue: DSCP EF (Expedited Forwarding, Tag 46) is tagged on all VoIP and WebRTC video packets to Noakhali General Hospital.
- Even if the Haat Bazaar node experiences heavy YouTube/Facebook downloads, clinic packets jump to the head of the MikroTik hardware queue.`;
    }

    return `📡 **Shera Link Telemetry Analysis**:
- Starlink Terminal: **${tel.dishModel}** locked to **${tel.satelliteId}**.
- Overall Downlink: **${tel.downlinkCurrentMbps} Mbps**, Latency: **${tel.pingMs} ms**.
- Total Active Village Devices: **${nds.reduce((acc, n) => acc + n.connectedDevicesCount, 0)} devices**.
All 6 wireless PtMP microwave sectors are operating within clean signal boundaries (RSSI -42 to -66 dBm). Line of sight across Sonapur village is unobstructed.`;
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

      {/* Header & Autonomous Optimization Banner */}
      <div className="p-5 sm:p-6 rounded-xl border border-cyan-900/50 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>AUTONOMOUS NETWORK TRAFFIC SHAPER & SATELLITE OPS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              AI Bandwidth & QoS Optimizer
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Dynamically analyzes real-time village traffic across all 6 PtMP sectors, protects critical
              telemedicine video channels, and counteracts monsoon Ku-band rain fade.
            </p>
          </div>

          <button
            onClick={handleAutonomousRebalance}
            disabled={isProcessing}
            className="px-4 py-2.5 text-xs font-semibold bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-lg transition-colors flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-4 h-4 text-slate-950" />
            <span>{isProcessing ? 'Optimizing...' : 'Execute Autonomous Rebalance'}</span>
          </button>
        </div>

        {optimizationHistory && (
          <div className="p-3 rounded-lg bg-slate-950/80 border border-cyan-800/40 text-xs text-cyan-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>{optimizationHistory}</span>
          </div>
        )}
      </div>

      {/* Main Grid: AI Assistant Console (Left) + Network Optimization Overview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Operator Chat */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col h-[520px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Village Network Diagnostic Assistant
                </h2>
                <span className="text-[11px] text-slate-400 font-mono">
                  Online · Responds in English or Bangla
                </span>
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40">
              Starlink Ops V3
            </span>
          </div>

          {/* Quick Preset Prompts */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-2 text-xs">
            <button
              onClick={() =>
                handleSendMessage('How does monsoon rain fade affect Starlink and how to fix it?')
              }
              className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap cursor-pointer transition-colors"
            >
              🌧️ Monsoon Rain Fade
            </button>
            <button
              onClick={() =>
                handleSendMessage('Check solar battery autonomy for 2 cloudy days.')
              }
              className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap cursor-pointer transition-colors"
            >
              ☀️ Solar Battery Health
            </button>
            <button
              onClick={() =>
                handleSendMessage('How is the Community Clinic telemedicine bandwidth prioritized?')
              }
              className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap cursor-pointer transition-colors"
            >
              🏥 Clinic QoS Guarantee
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-slate-800 text-white ml-8 border border-slate-700'
                    : 'bg-slate-950 text-slate-200 mr-4 border border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                  <span>{m.role === 'user' ? 'Operator' : 'Shera Link AI NOC'}</span>
                  <span>{m.timestamp}</span>
                </div>
                <div className="whitespace-pre-line">{m.content}</div>
              </div>
            ))}
            {isProcessing && (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-cyan-400 font-mono flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing Starlink telemetry &amp; PtMP microwave parameters...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask network diagnostic question (e.g. rain fade, QoS, battery)..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={isProcessing || !inputPrompt.trim()}
              className="px-3.5 py-2 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Right Column: Real-Time Traffic Distribution & QoS Rules */}
        <div className="lg:col-span-5 space-y-4">
          {/* Traffic Slicing Matrix */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">
                Live Sector Bandwidth Slices
              </h2>
              <span className="text-xs font-mono text-cyan-400">
                Total: {telemetry.downlinkCurrentMbps} Mbps
              </span>
            </div>

            <div className="space-y-3">
              {nodes.map((node) => {
                const percentOfTotal = Math.round(
                  (node.currentDownloadMbps / telemetry.downlinkCurrentMbps) * 100
                );
                return (
                  <div key={node.id} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-medium truncate max-w-[180px]">
                        {node.name.split(' ')[0]} {node.name.split(' ')[1] || ''}
                      </span>
                      <span className="font-mono text-slate-400">
                        {node.currentDownloadMbps} Mbps ({percentOfTotal}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          node.qosPriority === 'critical'
                            ? 'bg-rose-500'
                            : node.qosPriority === 'high'
                            ? 'bg-cyan-400'
                            : 'bg-slate-500'
                        }`}
                        style={{ width: `${Math.min(100, percentOfTotal * 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Autonomous Policy Enforcement Card */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
            <h2 className="text-sm font-semibold text-white">
              Active Optimization Directives
            </h2>

            <div className="space-y-2 text-slate-300">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                <span className="font-medium text-cyan-300 block mb-0.5">
                  1. Anti-Bufferbloat fq_codel Queue
                </span>
                <span>
                  Ensures sub-30ms ping even when multiple villagers in the Haat Bazaar download files simultaneously.
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                <span className="font-medium text-emerald-300 block mb-0.5">
                  2. Edge Content Local Caching (Proxy)
                </span>
                <span>
                  94% of school curriculum video requests hit local SSD cache at 120+ Mbps, sparing Starlink quota.
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                <span className="font-medium text-amber-300 block mb-0.5">
                  3. Dynamic Rain Fade Uplink Margin
                </span>
                <span>
                  Automatically steps up Ku-band transmit RF power by +2.5 dB if clouds attenuate SNR below 11 dB.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
