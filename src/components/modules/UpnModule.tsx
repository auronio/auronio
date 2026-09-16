import React from 'react';
import { UpnData } from '../../types';
import { validateUpnData, UPN_MAX_LENGTHS } from '../../lib/upnQr';
import { Landmark, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface UpnModuleProps {
  data: UpnData;
  onChange: (updated: UpnData) => void;
}

const PURPOSE_CODES: Array<{ code: string; label: string }> = [
  { code: 'RENT', label: 'RENT — Najemnina' },
  { code: 'COST', label: 'COST — Stroški / obveznosti' },
  { code: 'GDSV', label: 'GDSV — Blago in storitve' },
  { code: 'SALA', label: 'SALA — Plača' },
  { code: 'SUPP', label: 'SUPP — Dobavitelj' },
  { code: 'TAXS', label: 'TAXS — Davki' },
  { code: 'LOAN', label: 'LOAN — Posojilo' },
  { code: 'OTHR', label: 'OTHR — Drugo' },
];

const fieldClass =
  'w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs text-[#1D1D1F] font-mono font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-xs';

export const UpnModule: React.FC<UpnModuleProps> = ({ data, onChange }) => {
  const issues = validateUpnData(data);
  const issueFor = (field: keyof UpnData) => issues.find((i) => i.field === field)?.message;
  const borderClass = (field: keyof UpnData) =>
    issueFor(field) ? 'border-rose-300 focus:ring-rose-400/40' : 'border-stone-200';

  const set = (patch: Partial<UpnData>) => onChange({ ...data, ...patch });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200/80">
        <div className="flex items-center gap-2">
          <Landmark className="w-5 h-5 text-stone-700" />
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-semibold text-[#1D1D1F]">UPN QR — Plačilni nalog</h3>
            <div className="relative group/info inline-block">
              <Info className="w-4 h-4 text-slate-400 hover:text-blue-600 inline-block cursor-help transition-colors" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/info:block w-80 p-3 bg-slate-900 text-white text-[11px] leading-relaxed rounded-xl shadow-xl border border-slate-700 z-50 pointer-events-none transition-all text-center">
                Ustvarite QR kodo za slovenski univerzalni plačilni nalog (UPN QR). Kodo lahko stranka
                poskenira neposredno v mobilni banki — vsa polja se samodejno izpolnijo.
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
              </div>
            </div>
          </div>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
          Modul 1/7
        </span>
      </div>

      <p className="text-xs text-stone-600">
        Podatki so pripravljeni natanko po standardu ZBS UPN QR (verzija QR kode 15, ECC nivo M,
        ISO-8859-2 kodni nabor). Priporočamo, da pred uporabo generirano kodo preizkusite v svoji
        mobilni banki.
      </p>

      {/* PLAČNIK */}
      <div className="p-5 bg-stone-50/80 border border-stone-200/90 rounded-2xl space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Plačnik (neobvezno)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">Ime plačnika</label>
            <input
              type="text"
              value={data.payerName}
              onChange={(e) => set({ payerName: e.target.value })}
              maxLength={UPN_MAX_LENGTHS.payerName}
              className={`${fieldClass} ${borderClass('payerName')}`}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">Ulica in št.</label>
            <input
              type="text"
              value={data.payerAddress}
              onChange={(e) => set({ payerAddress: e.target.value })}
              maxLength={UPN_MAX_LENGTHS.payerAddress}
              className={`${fieldClass} ${borderClass('payerAddress')}`}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">Kraj</label>
            <input
              type="text"
              value={data.payerPlace}
              onChange={(e) => set({ payerPlace: e.target.value })}
              maxLength={UPN_MAX_LENGTHS.payerPlace}
              className={`${fieldClass} ${borderClass('payerPlace')}`}
            />
          </div>
        </div>
      </div>

      {/* ZNESEK / NAMEN */}
      <div className="p-5 bg-stone-50/80 border border-stone-200/90 rounded-2xl space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Znesek in namen</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">Znesek (EUR)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={data.amount}
              onChange={(e) => set({ amount: parseFloat(e.target.value) || 0 })}
              className={`${fieldClass} ${borderClass('amount')}`}
            />
            {issueFor('amount') && <p className="text-[11px] text-rose-600 mt-1">{issueFor('amount')}</p>}
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">Koda namena</label>
            <select
              value={data.purposeCode}
              onChange={(e) => set({ purposeCode: e.target.value })}
              className={`${fieldClass} ${borderClass('purposeCode')} cursor-pointer`}
            >
              {PURPOSE_CODES.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">Rok plačila</label>
            <input
              type="text"
              placeholder="DD.MM.LLLL (neobvezno)"
              value={data.dueDate}
              onChange={(e) => set({ dueDate: e.target.value })}
              maxLength={UPN_MAX_LENGTHS.dueDate}
              className={`${fieldClass} ${borderClass('dueDate')}`}
            />
            {issueFor('dueDate') && <p className="text-[11px] text-rose-600 mt-1">{issueFor('dueDate')}</p>}
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-stone-600 mb-1">Namen plačila</label>
          <input
            type="text"
            value={data.purposeText}
            onChange={(e) => set({ purposeText: e.target.value })}
            maxLength={UPN_MAX_LENGTHS.purposeText}
            className={`${fieldClass} ${borderClass('purposeText')}`}
          />
        </div>
      </div>

      {/* PREJEMNIK */}
      <div className="p-5 bg-stone-50/80 border border-stone-200/90 rounded-2xl space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Prejemnik (obvezno)</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">IBAN prejemnika</label>
            <input
              type="text"
              placeholder="SI56 0201 7001 4356 205"
              value={data.recipientIban}
              onChange={(e) => set({ recipientIban: e.target.value })}
              className={`${fieldClass} ${borderClass('recipientIban')}`}
            />
            {issueFor('recipientIban') && (
              <p className="text-[11px] text-rose-600 mt-1">{issueFor('recipientIban')}</p>
            )}
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
              Referenca (model + sklic)
            </label>
            <input
              type="text"
              placeholder="SI12 1234567890120"
              value={data.recipientReference}
              onChange={(e) => set({ recipientReference: e.target.value })}
              maxLength={UPN_MAX_LENGTHS.recipientReference}
              className={`${fieldClass} ${borderClass('recipientReference')}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">Ime prejemnika</label>
            <input
              type="text"
              value={data.recipientName}
              onChange={(e) => set({ recipientName: e.target.value })}
              maxLength={UPN_MAX_LENGTHS.recipientName}
              className={`${fieldClass} ${borderClass('recipientName')}`}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">Ulica in št.</label>
            <input
              type="text"
              value={data.recipientAddress}
              onChange={(e) => set({ recipientAddress: e.target.value })}
              maxLength={UPN_MAX_LENGTHS.recipientAddress}
              className={`${fieldClass} ${borderClass('recipientAddress')}`}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">Kraj</label>
            <input
              type="text"
              value={data.recipientPlace}
              onChange={(e) => set({ recipientPlace: e.target.value })}
              maxLength={UPN_MAX_LENGTHS.recipientPlace}
              className={`${fieldClass} ${borderClass('recipientPlace')}`}
            />
          </div>
        </div>
      </div>

      {/* Validation summary */}
      {issues.length > 0 ? (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-[11px] text-amber-900 space-y-0.5">
            <p className="font-semibold">Preverite podatke, preden kodo uporabite za plačilo:</p>
            {issues.map((issue, i) => (
              <p key={i}>• {issue.message}</p>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <p className="text-[11px] text-emerald-900">
            Podatki so skladni s standardom UPN QR. Priporočamo še realni test v mobilni banki.
          </p>
        </div>
      )}
    </div>
  );
};
