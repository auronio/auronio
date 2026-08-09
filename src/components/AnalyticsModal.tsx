import React from 'react';
import { X, TrendingUp, Users, MapPin, Smartphone, Calendar, Eye, FolderArchive, Crown, Shield } from 'lucide-react';
import { UserTier } from '../types';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userTier?: UserTier;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose, userTier = 'premium' }) => {
  if (!isOpen) return null;

  const maxScans = userTier === 'premium' ? 50000 : userTier === 'enterprise' ? 1000000 : userTier === 'uporabnik' ? 800 : 100;
  const maxFolders = userTier === 'premium' ? 20 : userTier === 'enterprise' ? 999 : userTier === 'uporabnik' ? 3 : 0;
  const currentScans = 1700;
  const currentFolders = 3;

  const scanPercentage = Math.min(100, Math.round((currentScans / maxScans) * 100));
  const folderPercentage = maxFolders > 0 ? Math.min(100, Math.round((currentFolders / maxFolders) * 100)) : 0;

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
              <h3 className="text-lg font-bold text-slate-900">Analitika skenov & Statistika v realnem času</h3>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0066CC] border border-blue-200 font-extrabold text-[10px] uppercase">
                {userTier}
              </span>
            </div>
            <p className="text-xs text-slate-500">Spremljajte obisk, zmogljivosti in kapaciteto vašega paketa.</p>
          </div>
        </div>

        {/* Dynamic Capacity Gauge Indicator */}
        <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
            <span className="flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-[#0066CC]" />
              Zmogljivost mesečnih skenov (Kapaciteta)
            </span>
            <span className="text-[#0066CC] font-extrabold">
              {currentScans.toLocaleString('sl-SI')} / {maxScans.toLocaleString('sl-SI')} skenov ({scanPercentage}%)
            </span>
          </div>
          <div className="w-full h-3 bg-blue-200/60 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-[#0066CC] rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${Math.max(4, scanPercentage)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
            <span>Organizacija map: <strong className="text-slate-900">{currentFolders} od {maxFolders} map po meri</strong> ({folderPercentage}%)</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-600" />
              {userTier === 'premium' ? 'Aktivna Premium zaščita' : 'Standardna zmogljivost'}
            </span>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex justify-between items-start">
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 block mb-1">Skupaj skenov</span>
              <div className="text-xl font-extrabold text-slate-900">1.428</div>
              <span className="text-[10px] font-semibold text-emerald-600">+18% ta teden</span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#0066CC] flex items-center justify-center shrink-0">
              <Eye className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex justify-between items-start">
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 block mb-1">Mesečni skeni</span>
              <div className="text-xl font-extrabold text-slate-900">{currentScans.toLocaleString('sl-SI')}</div>
              <span className="text-[10px] font-semibold text-emerald-600">+24% ta mesec</span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex justify-between items-start">
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 block mb-1">Top lokacija</span>
              <div className="text-xl font-extrabold text-slate-900">Ljubljana</div>
              <span className="text-[10px] font-semibold text-slate-500">42% skenov</span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex justify-between items-start">
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 block mb-1">Glavna naprava</span>
              <div className="text-xl font-extrabold text-slate-900">iOS iPhone</div>
              <span className="text-[10px] font-semibold text-slate-500">68% delež</span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Location Breakdown */}
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-800" />
            Porazdelitev skenov po regijah (Slovenija)
          </h4>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Osrednjeslovenska (Ljubljana)</span>
                <span>42% (600 skenov)</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#0066CC] rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Podravska (Maribor)</span>
                <span>24% (342 skenov)</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#0066CC] rounded-full" style={{ width: '24%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span>Obalno-kraška (Koper, Portorož)</span>
                <span>18% (257 skenov)</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#0066CC] rounded-full" style={{ width: '18%' }} />
              </div>
            </div>
          </div>
        </div>

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
