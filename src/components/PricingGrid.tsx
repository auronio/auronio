import React from 'react';
import { Check, Sparkles, ArrowRight, ShieldCheck, Mail } from 'lucide-react';

interface PricingGridProps {
  onScrollToGenerator?: () => void;
}

export const PricingGrid: React.FC<PricingGridProps> = ({
  onScrollToGenerator,
}) => {
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

          <a
            href="mailto:info@auronio.com?subject=Prijava%20za%20Auronio%20Beta"
            className="w-full mt-6 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900 transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-slate-700" />
            Zaprosi za beta dostop
          </a>
        </div>

        {/* Card 3: Partner pilot (Highlighted blue recommended card) */}
        <div className="bg-[#0066CC] text-white border border-blue-500 rounded-3xl p-6 flex flex-col justify-between transition-all relative shadow-xl overflow-hidden">
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/20 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white text-[#0066CC] flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3 text-[#0066CC]" /> ZGODNJI PARTNER
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Partner pilot</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">Brezplačno v beta obdobju</span>
              </div>
              <p className="text-xs text-blue-100 mt-1">
                Za podjetja, ki želijo Auronio preizkusiti v realnem okolju.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-blue-50 pt-3 border-t border-blue-400/50">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-white shrink-0" />
                Prednostni dostop do novih funkcij
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-white shrink-0" />
                Možnost testiranja dinamičnih QR scenarijev
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-white shrink-0" />
                Neposreden kanal za povratne informacije
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-white shrink-0" />
                Omejeno število partnerjev
              </li>
            </ul>
          </div>

          <div className="mt-6 relative z-10">
            <a
              href="mailto:info@auronio.com?subject=Interes%20za%20Auronio%20Partner%20pilot"
              className="w-full py-3 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-md text-center bg-white hover:bg-slate-100 text-[#0066CC] cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-[#0066CC]" />
              Postani partner pilot
            </a>
          </div>
        </div>

        {/* Card 4: Poslovne rešitve */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                ZA PODJETJA
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Poslovne rešitve</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">V pripravi</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Za ekipe in organizacije z zahtevnejšimi potrebami.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Več uporabnikov in napredna organizacija
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Prilagojene QR rešitve
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Možnost integracij v prihodnje
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Dostop po dogovoru
              </li>
            </ul>
          </div>

          <a
            href="mailto:info@auronio.com?subject=Poslovne%20potrebe%20za%20Auronio"
            className="w-full mt-6 py-2.5 px-4 bg-[#0066CC] hover:bg-[#0052A3] text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer text-center"
          >
            Povejte nam svoje potrebe
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Neutral Beta Notice */}
      <div className="p-4 bg-stone-100/90 border border-stone-200/80 rounded-2xl max-w-3xl mx-auto flex items-center justify-center gap-3 text-center">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
        <p className="text-xs text-stone-700 font-medium">
          Auronio je trenutno v brezplačnem beta programu. Ne zbiramo plačilnih podatkov in ne izvajamo samodejnih naročnin.
        </p>
      </div>
    </section>
  );
};
