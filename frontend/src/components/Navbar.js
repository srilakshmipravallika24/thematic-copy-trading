'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Users, MessageSquare, Layers, ShieldCheck, ArrowRightLeft } from 'lucide-react';

export default function Navbar() {
  const { user, isRIA, loginAsDemo, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <TrendingUp className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              <span>Thematic</span>
              <span className="text-emerald-400">Copy</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              Regulated RIA Mirror Network
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            <span>Thematic Baskets</span>
          </Link>
          <Link href="/advisors" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>Verified RIAs</span>
          </Link>
          <Link href="/social" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4" />
            <span>Advisory Forum</span>
          </Link>
          <Link href="/my-trades" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <ArrowRightLeft className="w-4 h-4" />
            <span>My Mirrored Trades</span>
          </Link>
        </nav>

        {/* User Account / Role switcher */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-white flex items-center justify-end gap-1">
              {user?.name}
              {isRIA && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
            </span>
            <span className="text-[11px] text-emerald-400/90 font-mono">
              {isRIA ? `RIA (${user?.riaProfile?.crdNumber})` : `Retail • Balance: $${user?.portfolioBalance?.toLocaleString()}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loginAsDemo(isRIA ? 'retail' : 'ria')}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition"
              title="Toggle role between Retail User and Registered Investment Advisor (RIA)"
            >
              Switch: {isRIA ? 'Retail Investor' : 'Verified RIA'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
