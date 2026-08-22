import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight, ShieldCheck, Mail, UserCheck } from 'lucide-react';
import { QuickInterestModal } from './QuickInterestModal';

interface PricingGridProps {
  onScrollToGenerator?: () => void;
  onOpenAuth?: () => void;
}

export const PricingGrid: React.FC<PricingGridProps> = ({
  onScrollToGenerator,
  onOpenAuth,
}) => {
  const [interestTier, setInterestTier] = useState<'beta' | 'partner' | 'pro' | 'business' | null>(null);
  const [isPartnerSelected, setIsPartnerSelected] = useState(false);

  const handleScrollToGenerator = () => {
    if (onScrollToGenerator) {
      onScrollToGenerator();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="mt-16 pt-12 border-t border-stone-200/80 space-y-8">
      {/* Section Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200/80 text-stone-700 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          BREZPLAČNI BETA PROGRAM
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Preizkusite Auronio v beta obdobju
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Izkusite pametne QR kode brez naročnin ali plačilnih podatkov ter sodelujte pri razvoju platforme.
        </p>
      </div>

      {/* 5-Column Beta Matrix: Gost / Auronio Beta / Partner / Pro / Poslovno */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Card 1: Gost */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                JAVNI DOSTOP
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Gost</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">Brezplačno</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Ustvarite osnovno statično QR kodo brez registracije.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Osnovno generiranje QR kod
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Takojšen prenos v PNG in SVG
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Brez prijave ali registracije
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={handleScrollToGenerator}
            className="w-full mt-6 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900 transition-all cursor-pointer text-center"
          >
            Ustvari QR kodo
          </button>
        </div>

        {/* Card 2: Auronio Beta */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                BREZPLAČNI PILOT
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Auronio Beta</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">0 €</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Registrirajte se brezplačno in shranjujte svoje QR kode v osebnem arhivu.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Registracija v manj kot minuti
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Preizkušanje QR modulov
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Povratne informacije neposredno vplivajo na razvoj
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Brez kartice in brez obveznosti
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onOpenAuth?.()}
            className="w-full mt-6 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900 transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer"
          >
            Registriraj se
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Partner pilot — ob kliku na gumb se obarva črno, enako kot Poslovna kartica */}
        <div
          className={`border rounded-3xl p-6 flex flex-col justify-between shadow-xs transition-all ${
            isPartnerSelected
              ? 'bg-slate-900 border-slate-900'
              : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isPartnerSelected ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                PARTNERSTVO
              </span>
            </div>

            <div>
              <h3 className={`text-xl font-bold ${isPartnerSelected ? 'text-white' : 'text-slate-900'}`}>
                Partner
              </h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className={`text-3xl font-black ${isPartnerSelected ? 'text-white' : 'text-slate-900'}`}>
                  Po dogovoru
                </span>
              </div>
              <p className={`text-xs mt-1 ${isPartnerSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                Za agencije in ponudnike, ki želijo Auronio vgraditi v svojo ponudbo.
              </p>
            </div>

            <ul
              className={`space-y-2.5 text-xs pt-3 border-t ${
                isPartnerSelected ? 'text-slate-300 border-slate-700' : 'text-slate-600 border-slate-100'
              }`}
            >
              <li className="flex items-center gap-2">
                <Check className={`w-4 h-4 shrink-0 ${isPartnerSelected ? 'text-emerald-400' : 'text-emerald-600'}`} />
                Razširjeno število map in modulov
              </li>
              <li className="flex items-center gap-2">
                <Check className={`w-4 h-4 shrink-0 ${isPartnerSelected ? 'text-emerald-400' : 'text-emerald-600'}`} />
                Prednostna podpora
              </li>
              <li className="flex items-center gap-2">
                <Check className={`w-4 h-4 shrink-0 ${isPartnerSelected ? 'text-emerald-400' : 'text-emerald-600'}`} />
                Vpliv na razvoj novih funkcij
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsPartnerSelected(true);
              setInterestTier('partner');
            }}
            className={`w-full mt-6 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer ${
              isPartnerSelected
                ? 'bg-white hover:bg-slate-100 text-slate-900'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Zaprosi za Partner pilot
          </button>
        </div>

        {/* Card 4: Pro (mesečna naročnina — Digistore24 checkout, ko bo odobren) */}
        <div className="bg-white border border-blue-200 rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:border-blue-300 transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
            Kmalu
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                NAROČNINA
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Pro</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">9,99 €</span>
                <span className="text-xs text-slate-500">/mesec</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Za posameznike in manjša podjetja, ki redno uporabljajo pametne QR kode.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Do 20 map po meri
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Do 100 aktivnih QR kod
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Do 50.000 skenov/mesec
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Brez vodnega žiga Auronio
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setInterestTier('pro')}
            className="w-full mt-6 py-2.5 px-4 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            Obvesti me ob zagonu
          </button>
        </div>

        {/* Card 5: Poslovno */}
        <div className="bg-slate-900 border border-slate-900 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                ZA PODJETJA
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Poslovno</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">Po dogovoru</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Prilagojen paket za organizacije z večjim številom uporabnikov.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-slate-700">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                Neomejeno število map in uporabnikov
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                Namenska podpora in SLA
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                Prilagoditve po meri
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setInterestTier('business')}
            className="w-full mt-6 py-2.5 px-4 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-900 transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            Povejte nam svoje potrebe
          </button>
        </div>
      </div>

      {interestTier && (
        <QuickInterestModal
          isOpen={!!interestTier}
          onClose={() => setInterestTier(null)}
          tier={interestTier}
        />
      )}
    </section>
  );
};
