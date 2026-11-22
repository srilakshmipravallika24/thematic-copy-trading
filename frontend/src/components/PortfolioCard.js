'use client';

import React, { useState } from 'react';
import AllocationBar from './AllocationBar';
import MirrorModal from './MirrorModal';
import { ShieldCheck, TrendingUp, Users, Award, ChevronRight } from 'lucide-react';

export default function PortfolioCard({ portfolio, onTradeSuccess }) {
  const [showMirrorModal, setShowMirrorModal] = useState(false);

  const riskBadgeColor =
    portfolio.riskScore > 7
      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
      : portfolio.riskScore > 4
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition flex flex-col justify-between backdrop-blur-sm group">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {portfolio.theme}
          </span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${riskBadgeColor}`}>
            Risk {portfolio.riskScore}/10
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition tracking-tight">
          {portfolio.title}
        </h3>
        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {portfolio.description}
        </p>

        {/* Advisor Details */}
        <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-slate-800/80">
          <img
            src={portfolio.advisor?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
            alt={portfolio.advisor?.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-700"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate flex items-center gap-1">
              <span>{portfolio.advisor?.name}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {portfolio.advisor?.riaProfile?.firmName || 'Apex Thematic Asset Mgmt'} • CRD #{portfolio.advisor?.riaProfile?.crdNumber || '6894021'}
            </div>
          </div>
        </div>

        {/* Allocation Bar */}
        <div className="mt-5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Top Holdings & Model Weights
          </div>
          <AllocationBar allocations={portfolio.allocations} />
        </div>
      </div>

      {/* Footer Metrics & Action Button */}
      <div className="mt-6 pt-4 border-t border-slate-800">
        <div className="grid grid-cols-3 gap-2 text-center mb-4">
          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block font-medium">1Y Return</span>
            <span className="text-sm font-bold text-emerald-400">+{portfolio.metrics?.oneYearReturn}%</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block font-medium">Sharpe</span>
            <span className="text-sm font-bold text-white">{portfolio.metrics?.sharpeRatio}</span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block font-medium">Copiers</span>
            <span className="text-sm font-bold text-white">{portfolio.copiersCount?.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={() => setShowMirrorModal(true)}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 group-hover:shadow-emerald-500/25"
        >
          <span>Mirror This Allocation</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <MirrorModal
        portfolio={portfolio}
        isOpen={showMirrorModal}
        onClose={() => setShowMirrorModal(false)}
        onSuccess={onTradeSuccess}
      />
    </div>
  );
}
