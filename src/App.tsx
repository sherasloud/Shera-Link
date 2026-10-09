import React, { useState } from 'react';
import {
  NavigationTab,
  StarlinkTelemetry,
  PowerTelemetry,
  VillageNode,
  VoucherPlan,
  ActiveSession,
} from './types';
import {
  initialStarlinkTelemetry,
  initialPowerTelemetry,
  villageNodesData,
  voucherPlansData,
  initialActiveSession,
  telemedicineConsultsData,
  cropPricesData,
  offlineCacheItemsData,
  villageNoticesData,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { TelemetryView } from './components/TelemetryView';
import { VillageMeshMapView } from './components/VillageMeshMapView';
import { VoucherPortalView } from './components/VoucherPortalView';
import { CommunityServicesView } from './components/CommunityServicesView';
import { AiNetworkOptimizer } from './components/AiNetworkOptimizer';
import { SpeedTestModal } from './components/SpeedTestModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('telemetry');
  const [telemetry, setTelemetry] = useState<StarlinkTelemetry>(initialStarlinkTelemetry);
  const [power, setPower] = useState<PowerTelemetry>(initialPowerTelemetry);
  const [nodes, setNodes] = useState<VillageNode[]>(villageNodesData);
  const [plans, setPlans] = useState<VoucherPlan[]>(voucherPlansData);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(initialActiveSession);
  const [isSpeedTestOpen, setIsSpeedTestOpen] = useState(false);

  // Handlers for telemetry actions
  const handleRefreshTelemetry = () => {
    setTelemetry((prev) => ({
      ...prev,
      downlinkCurrentMbps: Number((220 + Math.random() * 55).toFixed(1)),
      uplinkCurrentMbps: Number((34 + Math.random() * 12).toFixed(1)),
      pingMs: 24 + Math.floor(Math.random() * 6),
      snrDb: Number((13.2 + Math.random() * 1.5).toFixed(1)),
    }));
  };

  const handleAlignDish = () => {
    setTelemetry((prev) => ({
      ...prev,
      azimuthDeg: 148,
      elevationDeg: 65,
      obstructionPercent: 0.0,
      snrDb: 14.2,
    }));
  };

  const handleToggleHeater = () => {
    setTelemetry((prev) => ({
      ...prev,
      heaterStatus: prev.heaterStatus === 'AUTO_IDLE' ? 'MELTING_ACTIVE' : 'AUTO_IDLE',
    }));
  };

  // Handlers for node mesh
  const handleUpdateNodeQoS = (nodeId: string, priority: 'critical' | 'high' | 'standard') => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, qosPriority: priority } : n))
    );
  };

  const handleRebootNode = (nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              currentDownloadMbps: Number((n.currentDownloadMbps * 0.95).toFixed(1)),
            }
          : n
      )
    );
  };

  // Handlers for vouchers
  const handleActivatePlan = (plan: VoucherPlan, phone: string, method: string) => {
    const randomPin = `SHERA-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    const quotaMb = typeof plan.dataQuotaGB === 'number' ? plan.dataQuotaGB * 1024 : 102400;

    const newSession: ActiveSession = {
      code: randomPin,
      planName: plan.name,
      deviceMac: '3A:82:19:CF:04:E2',
      userPhone: phone,
      startTime: 'Just now',
      expiresInMinutes: plan.durationHours * 60,
      totalMinutes: plan.durationHours * 60,
      usedDataMb: 0,
      totalDataMb: quotaMb,
      status: 'active',
    };

    setActiveSession(newSession);
  };

  const handleRedeemCode = (code: string) => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned.length >= 6) {
      setActiveSession({
        code: cleaned,
        planName: 'Redeemed Scratch Card Pass (48h)',
        deviceMac: '3A:82:19:CF:04:E2',
        userPhone: '+880 1700-000000',
        startTime: 'Just now',
        expiresInMinutes: 2880,
        totalMinutes: 2880,
        usedDataMb: 0,
        totalDataMb: 10240,
        status: 'active',
      });
      return true;
    }
    return false;
  };

  const handleTopUpData = (additionalMb: number) => {
    if (!activeSession) return;
    setActiveSession((prev) =>
      prev
        ? {
            ...prev,
            totalDataMb: prev.totalDataMb + additionalMb,
          }
        : null
    );
  };

  const handleTogglePauseSession = () => {
    if (!activeSession) return;
    setActiveSession((prev) =>
      prev
        ? {
            ...prev,
            status: prev.status === 'active' ? 'paused' : 'active',
          }
        : null
    );
  };

  const handleApplyOptimizations = (optimizedNodes: VillageNode[]) => {
    setNodes(optimizedNodes);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSpeedTest={() => setIsSpeedTestOpen(true)}
        starlinkState={telemetry.terminalState}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'telemetry' && (
          <TelemetryView
            telemetry={telemetry}
            power={power}
            onRefreshTelemetry={handleRefreshTelemetry}
            onAlignDish={handleAlignDish}
            onToggleHeater={handleToggleHeater}
          />
        )}

        {activeTab === 'mesh_map' && (
          <VillageMeshMapView
            nodes={nodes}
            onUpdateNodeQoS={handleUpdateNodeQoS}
            onRebootNode={handleRebootNode}
          />
        )}

        {activeTab === 'vouchers' && (
          <VoucherPortalView
            plans={plans}
            activeSession={activeSession}
            onActivatePlan={handleActivatePlan}
            onRedeemCode={handleRedeemCode}
            onTopUpData={handleTopUpData}
            onTogglePauseSession={handleTogglePauseSession}
          />
        )}

        {activeTab === 'community' && (
          <CommunityServicesView
            consults={telemedicineConsultsData}
            cropPrices={cropPricesData}
            cacheItems={offlineCacheItemsData}
            notices={villageNoticesData}
          />
        )}

        {activeTab === 'ai_ops' && (
          <AiNetworkOptimizer
            nodes={nodes}
            telemetry={telemetry}
            power={power}
            onApplyOptimizations={handleApplyOptimizations}
          />
        )}
      </main>

      {/* Speed Test Modal */}
      <SpeedTestModal
        isOpen={isSpeedTestOpen}
        onClose={() => setIsSpeedTestOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Shera Link</span>
            <span>· Starlink Gen 3 High-Performance Rural Network Hub</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Char Meghna Union Ground Station</span>
            <span>·</span>
            <span>24/7 Village Operations Helpline: 16122</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
