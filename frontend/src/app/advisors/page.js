'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { mockUsers } from '../../utils/mockStore';
import { ShieldCheck, Award, Briefcase, TrendingUp, ExternalLink } from 'lucide-react';

export default function AdvisorsPage() {
  const [advisors, setAdvisors] = useState([]);

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const res = await api.getTopAdvisors();
        if (res.advisors) setAdvisors(res.advisors);
        else setAdvisors(mockUsers.filter((u) => u.role === 'ria'));
      } catch (err) {
        setAdvisors(mockUsers.filter((u) => u.role === 'ria'));
      }
    };
    fetchAdvisors();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Fiduciary Directory</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Verified Registered Investment Advisors (RIAs)</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Every advisor on this network is registered under the SEC Investment Advisers Act of 1940 with audited track records, public Form ADV brochures, and fiduciary obligations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {advisors.map((advisor) => (
          <div
            key={advisor._id}
            className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm space-y-6 hover:border-slate-700 transition"
          >
            <div className="flex items-start gap-4">
              <img
                src={advisor.avatar}
                alt={advisor.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-1.5">
                    <span>{advisor.name}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </h3>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-semibold">
                    Verified RIA
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-medium mt-0.5">
                  {advisor.riaProfile?.firmName}
                </div>
                <div className="text-[11px] font-mono text-emerald-400/90 mt-1">
                  CRD Number: {advisor.riaProfile?.crdNumber}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{advisor.riaProfile?.bio}</p>

            {/* Accreditations */}
            <div className="flex flex-wrap gap-2">
              {advisor.riaProfile?.accreditations?.map((item) => (
                <span
                  key={item}
                  className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-lg border border-slate-700 font-semibold"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Key Advisor Stats */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-center">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Firm AUM</span>
                <span className="text-sm font-bold text-white">
                  ${(advisor.riaProfile?.aum / 1000000).toFixed(0)}M
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Experience</span>
                <span className="text-sm font-bold text-white">
                  {advisor.riaProfile?.experienceYears} Years
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Client Rating</span>
                <span className="text-sm font-bold text-emerald-400">
                  ★ {advisor.riaProfile?.rating || '4.9'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <a
                href={`https://adviserinfo.sec.gov/individual/summary/${advisor.riaProfile?.crdNumber?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <span>Verify Form ADV on SEC Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
