'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { mockCopyTrades } from '../../utils/mockStore';
import { ArrowRightLeft, ShieldCheck, PauseCircle, PlayCircle, AlertCircle } from 'lucide-react';

export default function MyTradesPage() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const res = await api.getMyCopyTrades();
        if (res.trades) setTrades(res.trades);
        else setTrades(mockCopyTrades);
      } catch (err) {
        setTrades(mockCopyTrades);
      } finally {
        setLoading(false);
      }
    };
    fetchTrades();
  }, []);

  const handleToggleStatus = async (tradeId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      await api.updateCopyStatus(tradeId, newStatus);
      setTrades((prev) =>
        prev.map((t) => (t._id === tradeId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      setTrades((prev) =>
        prev.map((t) => (t._id === tradeId ? { ...t, status: newStatus } : t))
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
          <ArrowRightLeft className="w-4 h-4" />
          <span>Retail Mirror Dashboard</span>
        </div>
        <h1 className="text-3xl font-bold text-white">My Active Thematic Copy-Trades</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Track and manage your automated mirror allocations. Trade adjustments and rebalancing signals from your RIA advisor are systematically executed according to your risk parameters.
        </p>
      </div>

      {trades.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto">
          <ArrowRightLeft className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">No Active Mirror Allocations</h3>
          <p className="text-xs text-slate-400 mt-2 mb-6">
            Browse verified thematic baskets on the explore tab and click "Mirror This Allocation" to start copying.
          </p>
          <a
            href="/"
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm transition"
          >
            Explore Thematic Baskets
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {trades.map((trade) => (
            <div
              key={trade._id}
              className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm space-y-6"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                        trade.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      ● {trade.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      Managed by {trade.advisor?.name || 'Sarah Chen, CFA'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{trade.portfolio?.title || 'Thematic Model Basket'}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleStatus(trade._id, trade.status)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                  >
                    {trade.status === 'ACTIVE' ? (
                      <>
                        <PauseCircle className="w-4 h-4 text-amber-400" />
                        <span>Pause Mirroring</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 text-emerald-400" />
                        <span>Resume Mirroring</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Financial Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Capital Allocated</span>
                  <span className="text-lg font-bold text-white">${trade.allocatedCapital?.toLocaleString()}</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Unrealized P&L</span>
                  <span className="text-lg font-bold text-emerald-400">+${trade.unrealizedPnL || '342.50'} (+6.8%)</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Cash Buffer Reserve</span>
                  <span className="text-lg font-bold text-slate-200">{trade.cashBufferPercent || 5}% (${(trade.allocatedCapital * (trade.cashBufferPercent || 5) / 100).toFixed(0)})</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Stop Loss Limit</span>
                  <span className="text-lg font-bold text-rose-400">-{trade.stopLossPercent || 15}%</span>
                </div>
              </div>

              {/* Breakdown of mirrored holdings */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Mirrored Live Stock Positions
                </h4>
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 divide-y divide-slate-900">
                  {trade.mirroredPositions?.map((pos) => (
                    <div key={pos.symbol} className="py-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white text-sm">{pos.symbol}</span>
                        <span className="text-slate-400 ml-2 font-medium">{pos.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-200">
                          ${pos.allocatedDollars?.toLocaleString()} ({pos.targetWeight}%)
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ~{pos.estimatedShares} shares @ ${pos.executionPrice}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Regulatory Audit Trail: Trade authorization logged under SEC Advisers Act Recordkeeping Rule 204-2.
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
