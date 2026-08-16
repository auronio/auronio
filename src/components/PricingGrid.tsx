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
  const [interestTier, setInterestTier] = useState<'beta' | 'partner' | 'business' | null>(null);

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

      {/* 4-Column Beta Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                Preizkusite Auronio v omejenem beta programu.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Dostop na povabilo
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
