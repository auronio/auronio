import React from 'react';
import { X, Download, Mail, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

interface PartnerAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
}

// E-mail naslov, na katerega partnerji pošljejo podpisano pogodbo.
// Igor: če želiš drug naslov (npr. specifičen partner@auronio.com), samo zamenjaj spodnjo vrstico.
const PARTNER_CONTACT_EMAIL = 'igorkuzelj@tech-center.com';
const CONTRACT_PATH = '/Auronio_Podjemna_pogodba.pdf';

export const PartnerAccessModal: React.FC<PartnerAccessModalProps> = ({ isOpen, onClose, onOpenAuth }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 relative space-y-6">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 bg-stone-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Dostop kot partner</h3>
            <p className="text-xs text-slate-500">Prve 6 mesecev brezplačno, nato 88 €/leto.</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Korak 1 */}
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</div>
            <div className="flex-1 space-y-2">
              <p className="text-sm font-semibold text-slate-900">Prenesite pogodbo in jo preglejte</p>
              <a
                href={CONTRACT_PATH}
                download
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                Prenesi pogodbo (PDF)
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Korak 2 */}
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold text-slate-900">Podpišite in nam jo pošljite</p>
              <p className="text-xs text-slate-500">
                Skenirano ali fotografirano kopijo pošljite na{' '}
                <a href={`mailto:${PARTNER_CONTACT_EMAIL}`} className="text-blue-600 hover:underline font-medium">
                  {PARTNER_CONTACT_EMAIL}
                </a>
                . Pogodba je predlog — po dogovoru lahko karkoli prilagodiva pred podpisom.
              </p>
            </div>
          </div>

          {/* Korak 3 */}
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</div>
            <div className="flex-1 space-y-2">
              <p className="text-sm font-semibold text-slate-900">Registrirajte se in začnite takoj</p>
              <p className="text-xs text-slate-500">
                Ni vam treba čakati na podpis, da začnete — registracija je enaka kot pri brezplačnem paketu.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenAuth?.();
          }}
          className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center justify-center gap-1.5"
        >
          Registriraj se kot partner
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[11px] text-center text-slate-400">
          Vprašanja? Piši nam na{' '}
          <a href={`mailto:${PARTNER_CONTACT_EMAIL}`} className="text-blue-600 hover:underline">
            {PARTNER_CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </div>
  );
};
