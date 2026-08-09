import React from 'react';
import { X, Crown, CheckCircle2, Sparkles, FolderArchive, Layers, ArrowRight } from 'lucide-react';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200/90 relative space-y-6 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
          title="Zapri"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Crown Icon Badge */}
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-sm relative">
          <Crown className="w-9 h-9 fill-amber-500 text-amber-600" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            NAROČNINA USPEŠNO POTRJENA
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            Plačilo uspešno obdelano!
          </h2>
        </div>

        {/* Primary Slovene Copy Box */}
        <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-2xl text-left space-y-2">
          <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
            Hvala za nakup! 👑 Vaš Premium račun je uspešno aktiviran. Sedaj imate neomejen dostop do naprednih dinamičnih QR modulov, kapaciteto do 50.000 mesečnih skenov, vgradnjo logotipov in možnost organizacije do 20 map po meri.
          </p>
        </div>

        {/* Premium Benefits Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-left text-xs font-semibold text-stone-700">
          <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0066CC] shrink-0" />
            <span>Do 50.000 skenov / mesec</span>
          </div>

          <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl flex items-center gap-2">
            <FolderArchive className="w-4 h-4 text-purple-700 shrink-0" />
            <span>Do 20 map po meri</span>
          </div>
        </div>

        {/* Dismissal Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 px-5 bg-[#0066CC] hover:bg-[#0052A3] active:scale-[0.98] text-white font-bold rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Zapri in začni z uporabo Premium</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
