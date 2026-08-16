import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface QuickInterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: 'beta' | 'partner' | 'business';
}

const TIER_CONTENT: Record<string, { title: string; subtitle: string; button: string }> = {
  beta: {
    title: 'Prijava za Auronio Beta',
    subtitle: 'Pošlji nam svoj email in te povabimo v brezplačen beta program.',
    button: 'Pošlji prijavo',
  },
  partner: {
    title: 'Postani Partner pilot',
    subtitle: 'Pošlji nam svoj email in se pogovorimo o pilotnem sodelovanju.',
    button: 'Pošlji interes',
  },
  business: {
    title: 'Poslovne potrebe',
    subtitle: 'Na kratko opiši, kaj potrebuješ, in se ti oglasimo.',
    button: 'Pošlji povpraševanje',
  },
};

export const QuickInterestModal: React.FC<QuickInterestModalProps> = ({ isOpen, onClose, tier }) => {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const content = TIER_CONTENT[tier];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    const { error: fnError } = await supabase.functions.invoke('send-contact-email-Auronio', {
      body: { tier, name, email, message },
    });

    setSending(false);

    if (fnError) {
      setError('Pošiljanje ni uspelo. Poskusite znova ali nam pišite na info@auronio.com.');
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative space-y-5">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 bg-stone-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <h3 className="text-lg font-bold text-slate-900">{content.title}</h3>
          <p className="text-xs text-slate-500 mt-1">{content.subtitle}</p>
        </div>

        {submitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-900">Poslano!</h4>
            <p className="text-xs text-emerald-700">Oglasimo se ti v kratkem.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Ime</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Janez Novak"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ime@primer.si"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {tier === 'business' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Sporočilo (neobvezno)</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Na kratko opišite, kaj potrebujete..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            )}

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 px-4 bg-[#0066CC] hover:bg-[#0052A3] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Send className="w-3.5 h-3.5 text-blue-100" />
              {sending ? 'Pošiljam...' : content.button}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
