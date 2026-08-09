import React from 'react';
import { UserTier, AuthUser } from '../types';
import { Sparkles, FolderArchive, ShieldCheck, Crown, User, LogOut } from 'lucide-react';

interface HeaderProps {
  userTier: UserTier;
  authUser: AuthUser | null;
  onTierChange: (tier: UserTier) => void;
  onOpenSavedRecords: () => void;
  onOpenPricing: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userTier,
  authUser,
  onTierChange,
  onOpenSavedRecords,
  onOpenPricing,
  onOpenAuth,
  onLogout,
}) => {
  const getTierLabel = (tier: UserTier) => {
    switch (tier) {
      case 'gost':
        return 'Gost (Brezplačno)';
      case 'uporabnik':
        return 'Uporabnik';
      case 'premium':
        return 'Premium (19 €/m)';
      case 'enterprise':
        return 'Enterprise';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0066CC] text-white flex items-center justify-center font-bold text-lg tracking-tight shadow-sm border border-blue-400/20">
            A
          </div>

          <div>
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
              AURONIO
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">auronio.com • Napredne pametne QR kode</p>
          </div>
        </div>

        {/* Header Right Controls */}
        <div className="flex items-center gap-3">
          {/* Saved Records Button */}
          <button
            type="button"
            onClick={onOpenSavedRecords}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <FolderArchive className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Mape & Arhiv kod</span>
          </button>

          {/* Interactive Tier Quick Selector */}
          <div className="hidden md:flex items-center bg-slate-200/60 p-1 rounded-2xl border border-slate-300/50">
            {(['gost', 'uporabnik', 'premium', 'enterprise'] as UserTier[]).map((t) => (
              <button
                key={t}
                onClick={() => onTierChange(t)}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-xl transition-all capitalize ${
                  userTier === t
                    ? 'bg-[#0066CC] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === 'premium' && <Crown className="w-3 h-3 inline-block mr-1 text-amber-300" />}
                {t}
              </button>
            ))}
          </div>

          {/* Pricing Upgrade Button */}
          <button
            type="button"
            onClick={onOpenPricing}
            className="px-3.5 py-2 bg-[#0066CC] hover:bg-[#0052A3] text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span className="hidden lg:inline">Paketi & Cenik</span>
            <span className="lg:hidden">{getTierLabel(userTier)}</span>
          </button>

          {/* User Auth Section */}
          {authUser ? (
            <div className="flex items-center gap-2 bg-slate-100/90 pl-1.5 pr-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs">
              <div className="w-7 h-7 rounded-full bg-[#0066CC] text-white flex items-center justify-center text-xs font-extrabold shadow-xs">
                {authUser.initials}
              </div>
              <span className="text-xs font-bold text-slate-900 hidden sm:inline">
                {authUser.name}
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="p-1 text-slate-400 hover:text-red-600 transition-colors ml-1 cursor-pointer"
                title="Odjava"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <User className="w-4 h-4 text-slate-600" />
              <span>Prijava / Registracija</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
