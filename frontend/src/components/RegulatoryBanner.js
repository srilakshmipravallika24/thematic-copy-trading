'use client';

import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function RegulatoryBanner() {
  return (
    <div className="bg-slate-900/90 border-b border-emerald-500/30 px-4 py-2.5 text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-emerald-400 font-semibold">SEC / FINRA Regulated Framework:</strong> All advisors on this platform are registered investment advisors (RIAs) with verified Central Registration Depository (CRD) credentials.
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span>Form ADV Part 2A Publicly Disclosed</span>
          <span>•</span>
          <a
            href="https://adviserinfo.sec.gov"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 hover:underline"
          >
            Verify on SEC IAPD ↗
          </a>
        </div>
      </div>
    </div>
  );
}
