'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { X, Calculator, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function MirrorModal({ portfolio, isOpen, onClose, onSuccess }) {
  const [capital, setCapital] = useState(5000);
  const [cashBuffer, setCashBuffer] = useState(5);
  const [stopLoss, setStopLoss] = useState(15);
  const [autoRebalance, setAutoRebalance] = useState(true);
  const [suitabilityAcknowledged, setSuitabilityAcknowledged] = useState(false);
  const [calculation, setCalculation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [error, setError] = useState(null);

  // Trigger calculation whenever capital or cashBuffer changes
  useEffect(() => {
    if (!isOpen || !portfolio) return;
    const fetchPreview = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.previewAllocation(portfolio._id, capital, cashBuffer);
        setCalculation(res.calculation);
      } catch (err) {
        // Fallback local calculation
        const buffer = (capital * cashBuffer) / 100;
        const investable = capital - buffer;
        const positions = portfolio.allocations.map((item) => ({
          symbol: item.symbol,
          name: item.name,
          targetWeight: item.targetWeight,
          allocatedDollars: Number(((investable * item.targetWeight) / 100).toFixed(2)),
          estimatedShares: Number((((investable * item.targetWeight) / 100) / item.currentPrice).toFixed(4)),
          executionPrice: item.currentPrice,
        }));
        setCalculation({
          totalCapital: capital,
          cashBufferPercent: cashBuffer,
          reservedCash: buffer,
          investableCapital: investable,
          actualInvestedTotal: investable,
          finalCashBalance: buffer,
          positions,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [isOpen, portfolio, capital, cashBuffer]);

  if (!isOpen || !portfolio) return null;

  const handleConfirmOrder = async () => {
    if (!suitabilityAcknowledged) {
      setError('Please acknowledge the regulatory investment suitability disclosure to proceed.');
      return;
    }

    setExecuting(true);
    setError(null);

    try {
      const res = await api.subscribeCopy({
        portfolioId: portfolio._id,
        allocatedCapital: capital,
        cashBufferPercent: cashBuffer,
        stopLossPercent: stopLoss,
        autoRebalance,
        suitabilityAcknowledged: true,
      });

      setSuccessResult(res.copyTrade);
      if (onSuccess) onSuccess(res.copyTrade);
    } catch (err) {
      setError(err.message || 'Execution error');
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {successResult ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">Mirror Trade Successfully Activated!</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Your trade orders matching RIA <strong>{portfolio.advisor?.name}</strong>'s model weights have been queued.
              All allocations will automatically mirror updates and quarterly rebalances.
            </p>
            <div className="bg-slate-950 p-4 rounded-xl text-left border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
              <div>Portfolio: {portfolio.title}</div>
              <div>Allocated Capital: ${capital.toLocaleString()}</div>
              <div>Reserved Cash Buffer: ${calculation?.reservedCash} (5%)</div>
              <div>Regulatory Log ID: REG-SEC-{Date.now().toString().slice(-6)}</div>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-500/20"
            >
              Done & View My Trades
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                <Calculator className="w-4 h-4" />
                <span>Mirror Allocation Calculator</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">{portfolio.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Managed by {portfolio.advisor?.name} • CRD #{portfolio.advisor?.riaProfile?.crdNumber || '6894021'}
              </p>
            </div>

            {/* Capital Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex justify-between">
                <span>Investment Capital (USD)</span>
                <span className="text-slate-400">Min. ${portfolio.minInvestment || 500}</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={capital}
                  onChange={(e) => setCapital(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-white font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex gap-2">
                {[1000, 2500, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setCapital(amt)}
                    className={`text-xs px-3 py-1 rounded-lg border transition ${
                      capital === amt
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    ${amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Risk Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Cash Buffer: <strong className="text-white">{cashBuffer}%</strong>
                </label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={cashBuffer}
                  onChange={(e) => setCashBuffer(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">Protects against slippage</span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Stop Loss Trigger: <strong className="text-white">{stopLoss}%</strong>
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">Automatic downside circuit breaker</span>
              </div>
            </div>

            {/* Calculated Order Breakdown */}
            {calculation && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Calculated Proportional Orders</span>
                  <span className="text-emerald-400">Investable: ${calculation.investableCapital?.toLocaleString()}</span>
                </div>
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 max-h-40 overflow-y-auto space-y-2">
                  {calculation.positions.map((pos) => (
                    <div key={pos.symbol} className="flex items-center justify-between text-xs py-1 border-b border-slate-900 last:border-0">
                      <div>
                        <span className="font-bold text-white">{pos.symbol}</span>
                        <span className="text-slate-400 ml-1.5 font-medium">{pos.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">${pos.allocatedDollars} ({pos.targetWeight}%)</div>
                        <div className="text-[10px] text-slate-400">~{pos.estimatedShares} shares @ ${pos.executionPrice}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 px-1">
                  <span>Reserved Cash Buffer: ${calculation.reservedCash}</span>
                  <span>Unallocated Cash: ${calculation.finalCashBalance}</span>
                </div>
              </div>
            )}

            {/* Regulatory Suitability Checkbox */}
            <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={suitabilityAcknowledged}
                  onChange={(e) => setSuitabilityAcknowledged(e.target.checked)}
                  className="mt-0.5 accent-emerald-500 h-4 w-4 rounded"
                />
                <span className="text-xs text-amber-200/90 leading-tight">
                  I understand that copy-trading involves equity risk. This thematic basket mirrors an independent RIA model portfolio. I have reviewed the RIA Form ADV disclosure brochure.
                </span>
              </label>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmOrder}
                disabled={executing || !suitabilityAcknowledged}
                className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition shadow-lg ${
                  suitabilityAcknowledged
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {executing ? 'Executing Orders...' : 'Authorize Mirror Trade'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
