import React from 'react';
import { UrlData } from '../../types';
import { Globe, RefreshCw, Zap, ShieldCheck, Info } from 'lucide-react';

interface UrlModuleProps {
  data: UrlData;
  onChange: (updated: UrlData) => void;
}

export const UrlModule: React.FC<UrlModuleProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200/80">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-stone-700" />
          <h3 className="text-base font-semibold text-[#1D1D1F]">Spletna stran (URL)</h3>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
          Modul 1/5
        </span>
      </div>

      {/* URL Input */}
      <div>
        <label className="block text-xs font-medium text-stone-600 uppercase tracking-wider mb-2">
          Ciljna spletna povezava (URL)
        </label>
        <div className="relative">
          <input
            type="url"
            value={data.url}
            onChange={(e) => onChange({ ...data, url: e.target.value })}
            placeholder="https://auronio.com/stranka"
            className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition-all shadow-xs"
          />
        </div>
        <p className="text-xs text-stone-500 mt-1.5">
          Vnesite polno spletno mesto, na katero bo QR koda usmerila vaše obiskovalce.
        </p>
      </div>

      {/* Static / Dynamic Toggle */}
      <div className="p-4 bg-stone-50/80 border border-stone-200/90 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-0.5">
              Vrsta preusmeritve
            </span>
            <h4 className="text-sm font-semibold text-[#1D1D1F]">
              {data.pathType === 'dynamic' ? 'Dinamična pametna povezava' : 'Statična neposredna povezava'}
            </h4>
          </div>

          <div className="flex bg-stone-200/70 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => onChange({ ...data, pathType: 'static' })}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                data.pathType === 'static'
                  ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Statična
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...data, pathType: 'dynamic' })}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
                data.pathType === 'dynamic'
                  ? 'bg-[#1D1D1F] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Dinamična
            </button>
          </div>
        </div>

        {data.pathType === 'dynamic' ? (
          <div className="space-y-3 pt-2 border-t border-stone-200/60">
            <div className="flex items-start gap-2 text-xs text-stone-600">
              <RefreshCw className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Prilagodljiva vsebina:</strong> Ciljni URL lahko kadarkoli spremenite v nadzorni plošči, ne da bi morali natisniti novo QR kodo.
              </span>
            </div>

            <div>
              <div className="flex items-center mb-1">
                <label className="text-xs font-medium text-stone-600 uppercase tracking-wider">
                  UNIKATNI REP POVEZAVE PO MERI
                </label>
                <div className="relative group/info inline-block">
                  <Info className="w-4 h-4 text-slate-400 hover:text-blue-600 ml-2 inline-block cursor-help transition-colors" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/info:block w-80 p-3.5 bg-slate-900 text-white text-[11px] leading-relaxed rounded-xl shadow-xl border border-slate-700 z-50 pointer-events-none transition-all space-y-2">
                    <p>
                      Vnesite kratko besedo po izbiri (npr. &apos;koledarji&apos; ali &apos;akcija&apos;).
                    </p>
                    <p className="text-amber-300 font-medium">
                      ⚠️ ZELENO PRAVILO: Ko kodo enkrat natisnete na papir, te besede ne spreminjate več, saj se bo QR koda uničila. Ciljni spletni naslov zgoraj pa boste lahko kasneje v nadzorni plošči poljubno zamenjali vsak dan, ne da bi morali QR kodo kadarkoli ponovno tiskati!
                    </p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                  </div>
                </div>
              </div>
              <div className="flex rounded-xl overflow-hidden border border-stone-200 bg-white">
                <span className="inline-flex items-center px-3 text-xs text-stone-500 bg-stone-100 border-r border-stone-200 font-mono">
                  auronio.com/r/
                </span>
                <input
                  type="text"
                  value={data.customSlug}
                  onChange={(e) => onChange({ ...data, customSlug: e.target.value })}
                  placeholder="predloga"
                  className="w-full px-3 py-2 text-xs text-[#1D1D1F] focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2 text-xs text-stone-600 pt-1">
            <ShieldCheck className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
            <span>
              <strong>Neposredno kodirano:</strong> QR koda vsebuje točen URL naslov. Popolnoma deluje brez posrednikov in brez poteka veljavnosti.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
