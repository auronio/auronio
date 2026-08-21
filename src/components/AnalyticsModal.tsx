import React, { useEffect, useState } from 'react';
import { X, TrendingUp, Eye, Crown, Shield, Loader2 } from 'lucide-react';
import { UserTier } from '../types';
import { fetchAllRecords, fetchMonthlyScanCount } from '../lib/supabase';
import { getTierLimits } from '../lib/limits';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userTier?: UserTier;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose, userTier = 'gost' }) => {
  const [loading, setLoading] = useState(true);
  const [totalScans, setTotalScans] = useState(0);
  const [monthlyScans, setMonthlyScans] = useState(0);
  const [totalCodes, setTotalCodes] = useState(0);

  const limits = getTierLimits(userTier);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    setLoading(true);
    Promise.all([fetchAllRecords(), fetchMonthlyScanCount()]).then(([records, monthly]) => {
      if (cancelled) return;
      const sumAll = records.reduce((acc, r) => acc + (r.scanCount || 0), 0);
      setTotalScans(sumAll);
      setMonthlyScans(monthly);
      setTotalCodes(records.length);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxScans = Number.isFinite(limits.maxMonthlyScans) ? limits.maxMonthlyScans : monthlyScans || 1;
  const scanPercentage = Math.min(100, Math.round((monthlyScans / maxScans) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative space-y-6">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 bg-stone-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0066CC] text-white flex items-center justify-center shadow-xs">
            <TrendingUp className="w-5 h-5 text-blue-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">Analitika skenov</h3>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0066CC] border border-blue-200 font-extrabold text-[10px] uppercase">
                {limits.tierName}
              </span>
            </div>
            <p className="text-xs text-slate-500">Pravi podatki iz vaših QR kod, ne demo vrednosti.</p>
          </div>
        </div>

        {loading ? (
          <div className="py-10 flex items-center justify-center text-slate-400 gap-2 text-xs font-medium">
            <Loader2 className="w-4 h-4 animate-spin" />
            Nalagam podatke...
          </div>
        ) : (
          <>
            {/* Dynamic Capacity Gauge Indicator */}
            <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span className="flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-[#0066CC]" />
                  Zmogljivost mesečnih skenov (Kapaciteta)
                </span>
                <span className="text-[#0066CC] font-extrabold">
                  {monthlyScans.toLocaleString('sl-SI')} / {limits.scanDisplayCap} skenov ({scanPercentage}%)
                </span>
              </div>
              <div className="w-full h-3 bg-blue-200/60 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-[#0066CC] rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${Math.max(4, scanPercentage)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                <span>
                  Skupaj QR kod: <strong className="text-slate-900">{totalCodes} od {limits.codesDisplayCap}</strong>
                </span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-600" />
                  {limits.tierName}
                </span>
              </div>
            </div>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block mb-1">Skupaj skenov (vse kode)</span>
                  <div className="text-xl font-extrabold text-slate-900">{totalScans.toLocaleString('sl-SI')}</div>
                </div>
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#0066CC] flex items-center justify-center shrink-0">
                  <Eye className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block mb-1">Skeni ta mesec</span>
                  <div className="text-xl font-extrabold text-slate-900">{monthlyScans.toLocaleString('sl-SI')}</div>
                </div>
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Honest placeholder — geo/naprava analitika še ni implementirana, zato je ne izmišljujemo */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 text-center space-y-1">
              <p className="text-xs font-semibold text-slate-600">Porazdelitev po lokaciji in napravi prihaja kmalu</p>
              <p className="text-[11px] text-slate-400">
                Trenutno beležimo natančno število in datum vsakega skena. Podrobnejša analitika (regija, naprava) je naslednji korak razvoja.
              </p>
            </div>
          </>
        )}

        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0066CC] hover:bg-[#0052A3] text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Zapri analitiko
          </button>
        </div>
      </div>
    </div>
  );
};
