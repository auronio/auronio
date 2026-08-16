import React, { useState } from 'react';
import { X, User, Mail, Lock, UserCheck, ArrowRight, Sparkles, LogIn } from 'lucide-react';
import { AuthUser } from '../types';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  // Registration form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  if (!isOpen) return null;

  const extractInitials = (fullName: string): string => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return 'U';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: regEmail.trim(),
      password: regPassword,
      options: {
        data: { name: regName.trim() },
      },
    });

    setLoading(false);

    if (signUpError) {
      if (signUpError.message.toLowerCase().includes('already registered')) {
        setError('Ta email je že registriran. Poskusi se prijaviti namesto tega.');
      } else {
        setError(signUpError.message);
      }
      return;
    }

    // If there is no session yet, the project requires email confirmation.
    if (data.user && !data.session) {
      setConfirmationSent(true);
      return;
    }

    if (data.user) {
      onAuthSuccess({
        id: data.user.id,
        name: regName.trim(),
        email: regEmail.trim(),
        initials: extractInitials(regName),
      });
      onClose();
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword,
    });

    setLoading(false);

    if (signInError) {
      setError('Napačen email ali geslo.');
      return;
    }

    if (data.user) {
      const name = (data.user.user_metadata?.name as string) || data.user.email?.split('@')[0] || 'Uporabnik';
      onAuthSuccess({
        id: data.user.id,
        name,
        email: data.user.email || loginEmail.trim(),
        initials: extractInitials(name),
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative space-y-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
          title="Zapri"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066CC] flex items-center justify-center mx-auto border border-blue-100 shadow-xs">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
            Dobrodošli v Auronio Studio
          </h2>
          <p className="text-xs text-stone-500">
            Dostopajte do vaših shranjenih kod, map in analitike.
          </p>
        </div>

        {confirmationSent ? (
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl text-center space-y-2">
            <Mail className="w-10 h-10 text-blue-600 mx-auto" />
            <h4 className="text-sm font-bold text-blue-900">Preveri svoj email!</h4>
            <p className="text-xs text-blue-700">
              Poslali smo potrditveno povezavo na {regEmail}. Klikni nanjo, nato se lahko prijaviš.
            </p>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl border border-stone-200/80">
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setError(null); }}
                className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'register'
                    ? 'bg-white text-[#0066CC] shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Registracija
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setError(null); }}
                className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'login'
                    ? 'bg-white text-[#0066CC] shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                Prijava
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-center">{error}</p>
            )}

            {/* TAB 1: REGISTRACIJA */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Ime in priimek
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="npr. Boštjan Žlogar"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    E-mail naslov
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="ime@podjetje.si"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Geslo
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1">Vsaj 6 znakov.</p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-[#0066CC] hover:bg-[#0052A3] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] text-white font-bold rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Ustvarjam račun...' : 'Ustvarite brezplačen račun'}</span>
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-[11px] text-stone-500 text-center">
                  Z registracijo se strinjate s pogoji uporabe in varstvom podatkov.
                </p>
              </form>
            )}

            {/* TAB 2: PRIJAVA */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    E-mail naslov
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="ime@podjetje.si"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Geslo
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-[#0066CC] hover:bg-[#0052A3] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] text-white font-bold rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{loading ? 'Prijavljam...' : 'Prijavi se'}</span>
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
