'use client';

import React from 'react';

const COLORS = [
  'bg-emerald-500',
  'bg-cyan-500',
  'bg-blue-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
];

export default function AllocationBar({ allocations = [] }) {
  if (!allocations.length) return null;

  return (
    <div className="space-y-3">
      {/* Visual Bar */}
      <div className="h-2.5 w-full bg-slate-800 rounded-full flex overflow-hidden">
        {allocations.map((item, idx) => (
          <div
            key={item.symbol}
            className={`${COLORS[idx % COLORS.length]} transition-all duration-500`}
            style={{ width: `${item.targetWeight}%` }}
            title={`${item.symbol}: ${item.targetWeight}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 text-xs">
        {allocations.map((item, idx) => (
          <div
            key={item.symbol}
            className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60"
          >
            <span className={`w-2 h-2 rounded-full ${COLORS[idx % COLORS.length]}`} />
            <span className="font-semibold text-white">{item.symbol}</span>
            <span className="text-slate-400">{item.targetWeight}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
