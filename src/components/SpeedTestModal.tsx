import React, { useState, useEffect } from 'react';
import { Gauge, ArrowDown, ArrowUp, Activity, CheckCircle2, RotateCw } from 'lucide-react';

interface SpeedTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpeedTestModal: React.FC<SpeedTestModalProps> = ({ isOpen, onClose }) => {
  const [stage, setStage] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [ping, setPing] = useState(26);
  const [jitter, setJitter] = useState(3.4);
  const [finalDownload, setFinalDownload] = useState(0);
  const [finalUpload, setFinalUpload] = useState(0);
  const [speedHistory, setSpeedHistory] = useState<number[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setStage('idle');
      setCurrentSpeed(0);
      setFinalDownload(0);
      setFinalUpload(0);
      setSpeedHistory([]);
      return;
    }

    // Auto start test when modal opens
    startTest();
  }, [isOpen]);

  const startTest = () => {
    setStage('ping');
    setCurrentSpeed(0);
    setFinalDownload(0);
    setFinalUpload(0);
    setSpeedHistory([]);

    // Step 1: Ping (1.2s)
    setTimeout(() => {
      setPing(24 + Math.floor(Math.random() * 6));
      setJitter(2.8 + Number((Math.random() * 1.5).toFixed(1)));
      setStage('download');

      // Step 2: Download test (4.5s)
      let dlTicks = 0;
      const dlInterval = setInterval(() => {
        dlTicks++;
        const target = 230 + (Math.random() - 0.4) * 35;
        const progress = Math.min(1, dlTicks / 20);
        const speed = Math.round(target * (0.3 + 0.7 * progress));
        setCurrentSpeed(speed);
        setSpeedHistory((prev) => [...prev.slice(-24), speed]);

        if (dlTicks >= 22) {
          clearInterval(dlInterval);
          const dlResult = Number((220 + Math.random() * 45).toFixed(1));
          setFinalDownload(dlResult);
          setCurrentSpeed(0);
          setStage('upload');

          // Step 3: Upload test (3s)
          let ulTicks = 0;
          const ulInterval = setInterval(() => {
            ulTicks++;
            const ulTarget = 36 + (Math.random() - 0.5) * 8;
            const ulProgress = Math.min(1, ulTicks / 15);
            const ulSpeed = Number((ulTarget * (0.4 + 0.6 * ulProgress)).toFixed(1));
            setCurrentSpeed(ulSpeed);
            setSpeedHistory((prev) => [...prev.slice(-24), ulSpeed]);

            if (ulTicks >= 16) {
              clearInterval(ulInterval);
              const ulResult = Number((34 + Math.random() * 9).toFixed(1));
              setFinalUpload(ulResult);
              setCurrentSpeed(0);
              setStage('complete');
            }
          }, 180);
        }
      }, 200);
    }, 1200);
  };

  if (!isOpen) return null;

  // Max scale is 300 Mbps for gauge
  const maxScale = stage === 'upload' ? 60 : 300;
  const normalizedSpeed = Math.min(1, currentSpeed / maxScale);
  const needleRotation = -120 + normalizedSpeed * 240;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="text-xs font-mono text-cyan-400">STARLINK BROADBAND SPEEDTEST</div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Village Backhaul Throughput
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {/* Speedometer Gauge */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="relative w-56 h-40 flex items-center justify-center">
            <svg viewBox="0 0 200 140" className="w-full h-full">
              {/* Gauge Arc Background */}
              <path
                d="M 30 120 A 75 75 0 1 1 170 120"
                fill="none"
                stroke="#1e293b"
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* Active Gauge Arc */}
              <path
                d="M 30 120 A 75 75 0 1 1 170 120"
                fill="none"
                stroke={stage === 'upload' ? '#38bdf8' : '#06b6d4'}
                strokeWidth="12"
                strokeDasharray="280"
                strokeDashoffset={280 - normalizedSpeed * 280}
                strokeLinecap="round"
                className="transition-all duration-150"
              />
              {/* Center Pivot */}
              <circle cx="100" cy="115" r="7" fill="#f8fafc" />
              {/* Needle */}
              <line
                x1="100"
                y1="115"
                x2={100 + 55 * Math.cos((needleRotation * Math.PI) / 180)}
                y2={115 + 55 * Math.sin((needleRotation * Math.PI) / 180)}
                stroke="#38bdf8"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="transition-all duration-150"
              />
            </svg>

            {/* Center Digital Speed Counter */}
            <div className="absolute bottom-2 text-center">
              <div className="text-3xl font-extrabold font-mono text-white tabular-nums tracking-tight">
                {stage === 'complete' ? finalDownload : currentSpeed}
              </div>
              <div className="text-xs font-mono text-slate-400">
                {stage === 'ping'
                  ? 'Testing Latency...'
                  : stage === 'download'
                  ? 'Testing Downlink...'
                  : stage === 'upload'
                  ? 'Testing Uplink...'
                  : 'Mbps Downlink'}
              </div>
            </div>
          </div>

          {/* Test Status Kicker */}
          <div className="text-xs font-mono text-cyan-400 mt-2">
            {stage === 'idle' && 'Ready to test'}
            {stage === 'ping' && 'Pinging Starlink Ground Station POP...'}
            {stage === 'download' && 'Measuring Downlink Channel Capacity...'}
            {stage === 'upload' && 'Measuring Uplink Ku-Band Beam...'}
            {stage === 'complete' && 'Diagnostic Test Completed Successfully'}
          </div>
        </div>

        {/* Live Sparkline History */}
        {speedHistory.length > 2 && (
          <div className="h-12 w-full bg-slate-950 rounded border border-slate-800/80 p-1 flex items-end gap-1 overflow-hidden">
            {speedHistory.map((val, idx) => (
              <div
                key={idx}
                className="flex-1 bg-cyan-400/80 rounded-t transition-all"
                style={{ height: `${Math.min(100, (val / maxScale) * 100)}%` }}
              />
            ))}
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px] mb-0.5">Ping</span>
            <span className="text-base font-bold font-mono text-white tabular-nums">
              {ping} <span className="text-[10px] text-slate-400 font-normal">ms</span>
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px] mb-0.5">Jitter</span>
            <span className="text-base font-bold font-mono text-white tabular-nums">
              {jitter} <span className="text-[10px] text-slate-400 font-normal">ms</span>
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px] mb-0.5 flex items-center justify-center gap-1">
              <ArrowDown className="w-3 h-3 text-cyan-400" />
              Download
            </span>
            <span className="text-base font-bold font-mono text-cyan-400 tabular-nums">
              {finalDownload > 0 ? finalDownload : '--'} <span className="text-[10px] text-slate-400 font-normal">Mbps</span>
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px] mb-0.5 flex items-center justify-center gap-1">
              <ArrowUp className="w-3 h-3 text-cyan-400" />
              Upload
            </span>
            <span className="text-base font-bold font-mono text-cyan-400 tabular-nums">
              {finalUpload > 0 ? finalUpload : '--'} <span className="text-[10px] text-slate-400 font-normal">Mbps</span>
            </span>
          </div>
        </div>

        {/* Server & POP Info */}
        <div className="text-[11px] text-slate-400 font-mono space-y-1 bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
          <div>Ground Station: Starlink POP Bangladesh / SingTel Equinix IX</div>
          <div>Terminal: Flat High-Performance Gen 3 · IP: 100.92.14.73</div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={startTest}
            disabled={stage !== 'complete' && stage !== 'idle'}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Test Again</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
