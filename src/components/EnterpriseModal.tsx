import React, { useState } from 'react';
import { X, Building2, Send, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EnterpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnterpriseModal: React.FC<EnterpriseModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    employees: '50-250',
    email: '',
    phone: '',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    const { error: fnError } = await supabase.functions.invoke('send-contact-email-Auronio', {
      body: {
        tier: 'enterprise',
        name: formData.companyName,
        companyName: formData.companyName,
        employees: formData.employees,
        email: formData.email,
        phone: formData.phone,
        message: formData.notes,
      },
    });

    setSending(false);

    if (fnError) {
      setError('Pošiljanje ni uspelo. Poskusite znova ali nam pišite na info@auronio.com.');
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative space-y-6">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 bg-stone-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0066CC] text-white flex items-center justify-center shadow-xs">
            <Building2 className="w-5 h-5 text-blue-100" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Enterprise zahtevek za podjetja</h3>
            <p className="text-xs text-slate-500">Prilagojene rešitve in korporativna integracija Auronio.</p>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-900">Zahtevek uspešno poslan!</h4>
            <p className="text-xs text-emerald-700">
              Naša ekipa vas bo kontaktirala v roku 24 ur s prilagojeno ponudbo.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Naziv podjetja ali organizacije
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Ime vašega podjetja d.o.o."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Število zaposlenih</label>
                <select
                  value={formData.employees}
                  onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                >
                  <option value="10-50">10–50 zaposlenih</option>
                  <option value="50-250">50–250 zaposlenih</option>
                  <option value="250+">250+ zaposlenih</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Telefonska številka</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+386 1 234 5678"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Poslovni e-poštni naslov</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="vodstvo@podjetje.si"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Opis projekta in zahteve</label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Opišite vaše potrebe glede pametnih QR kod, API integracij ali GDPR zahtev..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 px-4 bg-[#0066CC] hover:bg-[#0052A3] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Send className="w-3.5 h-3.5 text-blue-100" />
              {sending ? 'Pošiljam...' : 'Pošlji Enterprise povpraševanje'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
