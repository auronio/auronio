import React from 'react';
import { UserTier } from '../types';
import { Check, Crown, Shield, Building, Sparkles, Lock, ArrowRight, Building2 } from 'lucide-react';

interface PricingGridProps {
  currentTier: UserTier;
  onSelectTier: (tier: UserTier) => void;
  onOpenEnterpriseModal: () => void;
}

export const PricingGrid: React.FC<PricingGridProps> = ({
  currentTier,
  onSelectTier,
  onOpenEnterpriseModal,
}) => {
  return (
    <section className="mt-16 pt-12 border-t border-stone-200/80 space-y-8">
      {/* Section Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200/80 text-stone-700 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          MONETIZACIJSKA MATRIKA & NAROČNINE
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Izberite paket po meri vašega podjetja
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Prilagodljive evropske naročnine z napredno analitiko, dinamiko povezav in prestižnim oblikovanjem.
        </p>
      </div>

      {/* 4-Column Pricing Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tier 1: Gost */}
        <div
          className={`bg-white border rounded-3xl p-6 flex flex-col justify-between transition-all relative ${
            currentTier === 'gost'
              ? 'ring-2 ring-[#0066CC] border-[#0066CC] shadow-md'
              : 'border-slate-200/90 shadow-xs hover:border-slate-300'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Neregistriran gost
              </span>
              {currentTier === 'gost' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-300">
                  Aktivno
                </span>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Gost</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">Brezplačno</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Omejitev 100 mesečnih skenov in ogled map</p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Osnovno generiranje statičnih QR kod
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Omejitev 100 mesečnih skenov
              </li>
              <li className="flex items-center gap-2 text-slate-500">
                <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                Sistemske mape s ključavnico (ogled omogočen)
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                Brez ustvarjanja map po meri
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                Brez nalaganja logotipa
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onSelectTier('gost')}
            className={`w-full mt-6 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
              currentTier === 'gost'
                ? 'bg-slate-100 text-slate-800 cursor-default'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
            }`}
          >
            {currentTier === 'gost' ? 'Trenutni paket' : 'Izberi Gost'}
          </button>
        </div>

        {/* Tier 2: Uporabnik */}
        <div
          className={`bg-white border rounded-3xl p-6 flex flex-col justify-between transition-all relative ${
            currentTier === 'uporabnik'
              ? 'ring-2 ring-[#0066CC] border-[#0066CC] shadow-md'
              : 'border-slate-200/90 shadow-xs hover:border-slate-300'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Brezplačna registracija
              </span>
              {currentTier === 'uporabnik' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-300">
                  Aktivno
                </span>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Uporabnik</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">0 €</span>
                <span className="text-xs text-slate-500 font-medium">/ mesec</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Do 5 aktivnih kod in 800 mesečnih skenov</p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Do 5 aktivnih QR kod
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Kapaciteta: 800 skenov mesečno
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Do 3 lastne mape po meri
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Dostop do vseh osnovnih modulov
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                Brez logotipa podjetja na QR
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onSelectTier('uporabnik')}
            className={`w-full mt-6 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
              currentTier === 'uporabnik'
                ? 'bg-slate-100 text-slate-800 cursor-default'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
            }`}
          >
            {currentTier === 'uporabnik' ? 'Trenutni paket' : 'Izberi Uporabnik'}
          </button>
        </div>

        {/* Tier 3: Premium (Highlight) */}
        <div
          className={`bg-[#0066CC] text-white border rounded-3xl p-6 flex flex-col justify-between transition-all relative shadow-xl overflow-hidden ${
            currentTier === 'premium' ? 'ring-2 ring-white border-white' : 'border-blue-500'
          }`}
        >
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/20 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white text-[#0066CC] flex items-center gap-1 shadow-xs">
                <Crown className="w-3 h-3 fill-[#0066CC]" /> PRIPOROČENO
              </span>
              {currentTier === 'premium' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-800 text-white border border-blue-400">
                  Aktivno
                </span>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-1.5">
                Premium
              </h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">19 €</span>
                <span className="text-xs text-blue-100 font-medium">/ mesec</span>
              </div>
              <p className="text-xs text-blue-100 mt-1">Popolna svoboda oblikovanja in do 20 map po meri</p>
            </div>

            <ul className="space-y-2.5 text-xs text-blue-50 pt-3 border-t border-blue-400/50">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-white shrink-0" />
                Do 100 aktivnih QR kod
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-white shrink-0" />
                50.000 skenov na mesec
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-white shrink-0" />
                Do 20 map po meri (zaščita pomnilnika)
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-white shrink-0" />
                Nalaganje lastnega logotipa podjetja
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-white shrink-0" />
                Prestižne pikčaste strukture
              </li>
            </ul>
          </div>

          <div className="mt-6 relative z-10">
            <button
              type="button"
              onClick={() => {
                onSelectTier('premium');
              }}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-md text-center bg-white hover:bg-slate-100 text-[#0066CC] cursor-pointer"
            >
              <span>Kontaktirajte nas za Premium</span>
            </button>
          </div>
        </div>

        {/* Tier 4: Enterprise */}
        <div
          className={`bg-white border rounded-3xl p-6 flex flex-col justify-between transition-all relative ${
            currentTier === 'enterprise'
              ? 'ring-2 ring-[#0066CC] border-[#0066CC] shadow-md'
              : 'border-slate-200/90 shadow-xs hover:border-slate-300'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Za velika podjetja
              </span>
              <Building className="w-4 h-4 text-slate-700" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Enterprise</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">Po dogovoru</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Za hotele, verige restavracij in velika podjetja</p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Neomejeno število aktivnih QR kod
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Neomejeni skeni & namenski strežnik
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Neomejeno ustvarjanje map po meri
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                SSO integracija, namenski skrbnik & GDPR SLA
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => {
              onSelectTier('enterprise');
              onOpenEnterpriseModal();
            }}
            className="w-full mt-6 py-2.5 px-4 bg-[#0066CC] hover:bg-[#0052A3] text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            Kontaktiraj Enterprise
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Required European Payment Trust Notice */}
      <div className="p-4 bg-stone-100/90 border border-stone-200/80 rounded-2xl max-w-3xl mx-auto flex items-center justify-center gap-3 text-center">
        <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
        <p className="text-xs text-stone-700 font-medium">
          Omogočamo varna plačila preko uradno preverjenega in šifriranega evropskega plačilnega sistema.
        </p>
      </div>
    </section>
  );
};
