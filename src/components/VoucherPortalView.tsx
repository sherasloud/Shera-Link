import React, { useState, useEffect } from 'react';
import { VoucherPlan, ActiveSession } from '../types';
import {
  CreditCard,
  Ticket,
  Clock,
  HardDrive,
  QrCode,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Zap,
  ArrowRight,
  Wifi,
  Copy,
  PlusCircle,
} from 'lucide-react';

interface VoucherPortalViewProps {
  plans: VoucherPlan[];
  activeSession: ActiveSession | null;
  onActivatePlan: (plan: VoucherPlan, phone: string, method: string) => void;
  onRedeemCode: (code: string) => boolean;
  onTopUpData: (additionalMb: number) => void;
  onTogglePauseSession: () => void;
}

export const VoucherPortalView: React.FC<VoucherPortalViewProps> = ({
  plans,
  activeSession,
  onActivatePlan,
  onRedeemCode,
  onTopUpData,
  onTogglePauseSession,
}) => {
  const [currency, setCurrency] = useState<'BDT' | 'USD'>('BDT');
  const [selectedPlanForPurchase, setSelectedPlanForPurchase] = useState<VoucherPlan | null>(null);
  const [buyerPhone, setBuyerPhone] = useState('01712-849201');
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Cash_Storekeeper'>('bKash');
  const [manualCodeInput, setManualCodeInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live countdown timer for active session
  const [remainingSec, setRemainingSec] = useState(
    activeSession ? activeSession.expiresInMinutes * 60 : 0
  );

  useEffect(() => {
    if (!activeSession || activeSession.status !== 'active') return;
    const interval = setInterval(() => {
      setRemainingSec((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    showToast(`Voucher PIN ${text} copied to clipboard!`);
  };

  const handleManualRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCodeInput.trim()) return;
    const success = onRedeemCode(manualCodeInput.trim());
    if (success) {
      showToast(`Voucher ${manualCodeInput.toUpperCase()} activated successfully!`);
      setManualCodeInput('');
    } else {
      showToast(`Invalid voucher format. Please check your printed card.`);
    }
  };

  const handleCompletePurchase = () => {
    if (!selectedPlanForPurchase) return;
    onActivatePlan(selectedPlanForPurchase, buyerPhone, paymentMethod);
    showToast(
      `Voucher for "${selectedPlanForPurchase.name}" purchased via ${paymentMethod.replace('_', ' ')}!`
    );
    setSelectedPlanForPurchase(null);
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
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

      {/* Header & Currency Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Village Micro-Voucher Portal & Access
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Fair, affordable rural internet vouchers powered by Starlink. Buy via bKash, Nagad, or village storekeeper.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setCurrency('BDT')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              currency === 'BDT'
                ? 'bg-slate-800 text-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ৳ BDT (Taka)
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              currency === 'USD'
                ? 'bg-slate-800 text-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            $ USD
          </button>
        </div>
      </div>

      {/* Active Session Card (if user has active plan) */}
      {activeSession && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-900/60 rounded-xl p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <span>ACTIVE SESSION CODE: {activeSession.code}</span>
                <span aria-hidden="true">·</span>
                <span className="uppercase text-emerald-400 font-semibold">{activeSession.status}</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {activeSession.planName}
              </h2>
              <div className="text-xs text-slate-400 mt-0.5 font-mono">
                Device MAC: {activeSession.deviceMac} · Associated Phone: {activeSession.userPhone}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onTogglePauseSession();
                  showToast(
                    activeSession.status === 'active'
                      ? 'Internet session paused. Quota timer frozen.'
                      : 'Internet session resumed.'
                  );
                }}
                className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                {activeSession.status === 'active' ? 'Pause Connection' : 'Resume Connection'}
              </button>

              <button
                onClick={() => {
                  onTopUpData(2048);
                  showToast('Added +2.0 GB quota top-up for ৳15.');
                }}
                className="px-3.5 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Top-up 2 GB (৳15)</span>
              </button>
            </div>
          </div>

          {/* Active Session Telemetry Counters */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Time Countdown */}
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Remaining Validity
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-white tabular-nums">
                {formatTime(remainingSec)}
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Activated: {activeSession.startTime}
              </span>
            </div>

            {/* Quota Progress */}
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                  Data Quota Used
                </span>
                <span className="font-mono text-slate-300 text-xs">
                  {(activeSession.usedDataMb / 1024).toFixed(2)} / {(activeSession.totalDataMb / 1024).toFixed(0)} GB
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 my-2 overflow-hidden">
                <div
                  className="bg-cyan-400 h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (activeSession.usedDataMb / activeSession.totalDataMb) * 100)}%`,
                  }}
                />
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {((activeSession.totalDataMb - activeSession.usedDataMb) / 1024).toFixed(2)} GB data remaining
              </span>
            </div>

            {/* Current Active Speed */}
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                  Associated Hotspot AP
                </span>
              </div>
              <div className="text-sm font-semibold text-white">
                Sonapur Central Tower #2
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">
                Speed Cap: 35 Mbps (Unthrottled)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Manual Physical Scratch-Card Redeem Box */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Ticket className="w-4 h-4 text-cyan-400" />
            Have a Printed Scratch Card from Village Storekeeper?
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Enter the 12-digit PIN code printed under the silver scratch foil on your paper voucher.
          </p>
        </div>

        <form onSubmit={handleManualRedeem} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="e.g. SHERA-4821-9924"
            value={manualCodeInput}
            onChange={(e) => setManualCodeInput(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono uppercase text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48 sm:w-56"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            Redeem PIN
          </button>
        </form>
      </div>

      {/* Voucher Plans Grid */}
      <div>
        <h2 className="text-base font-semibold text-white mb-3">
          Available Village Connectivity Plans
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isClinic = plan.category === 'clinic_free';
            return (
              <div
                key={plan.id}
                className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                  isClinic
                    ? 'bg-slate-900/50 border-emerald-900/50'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Plan Badge & Duration */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-slate-400">{plan.durationLabel}</span>
                    {plan.badge && (
                      <span className="text-[11px] font-medium text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/50">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  {/* Plan Title */}
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {plan.name}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {plan.bengaliName}
                  </div>

                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Feature Matrix */}
                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Data Quota</span>
                      <span className="font-mono font-medium text-white">
                        {typeof plan.dataQuotaGB === 'number' ? `${plan.dataQuotaGB} GB` : 'Unlimited'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Peak Speed Cap</span>
                      <span className="font-mono font-medium text-white">
                        Up to {plan.speedCapMbps} Mbps
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Target Audience</span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[170px]">
                        {plan.targetAudience.split(',')[0]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Pricing</span>
                    <div className="text-xl font-bold font-mono text-white">
                      {currency === 'BDT' ? `৳ ${plan.priceBDT}` : `$ ${plan.priceUSD.toFixed(2)}`}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPlanForPurchase(plan)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                      isClinic
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold'
                    }`}
                  >
                    <span>{isClinic ? 'Activate Free' : 'Purchase Pass'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Purchase Modal */}
      {selectedPlanForPurchase && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400">VOUCHER ORDER</span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {selectedPlanForPurchase.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedPlanForPurchase.bengaliName}
                </p>
              </div>
              <button
                onClick={() => setSelectedPlanForPurchase(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Mobile Financial Service Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(
                  [
                    { id: 'bKash', label: 'bKash (বিকাশ)', color: 'border-pink-500/40 text-pink-300' },
                    { id: 'Nagad', label: 'Nagad (নগদ)', color: 'border-orange-500/40 text-orange-300' },
                    { id: 'Rocket', label: 'Rocket (রকেট)', color: 'border-purple-500/40 text-purple-300' },
                    { id: 'Cash_Storekeeper', label: 'Cash at Grocery Store', color: 'border-emerald-500/40 text-emerald-300' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                      paymentMethod === m.id
                        ? `bg-slate-800 ${m.color} font-semibold ring-1 ring-cyan-500`
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* User Phone Number */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Mobile Number (For SMS PIN & Voucher receipt)
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Order Total */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Due Amount</span>
              <span className="text-lg font-bold font-mono text-cyan-400">
                {currency === 'BDT'
                  ? `৳ ${selectedPlanForPurchase.priceBDT} BDT`
                  : `$ ${selectedPlanForPurchase.priceUSD.toFixed(2)} USD`}
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPlanForPurchase(null)}
                className="w-1/2 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompletePurchase}
                className="w-1/2 py-2 text-xs font-semibold bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-lg transition-colors cursor-pointer"
              >
                Confirm & Activate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
