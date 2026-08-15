import React from 'react';
import { UserTier, AuthUser } from '../types';
import { Sparkles, FolderArchive, User, LogOut } from 'lucide-react';

interface HeaderProps {
  userTier: UserTier;
  authUser: AuthUser | null;
  onOpenSavedRecords: () => void;
  onOpenPricing: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  authUser,
  onOpenSavedRecords,
  onOpenPricing,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0066CC] text-white flex items-center justify-center font-bold text-lg tracking-tight shadow-sm border border-blue-400/20">
            A
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
                AURONIO
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0066CC] border border-blue-200 uppercase tracking-wide">
                Beta
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">auronio.com • Napredne pametne QR kode</p>
          </div>
        </div>

        {/* Header Right Controls */}
        <div className="flex items-center gap-3">
          {/* Saved Records Button */}
          <button
            type="button"
            onClick={onOpenSavedRecords}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <FolderArchive className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Mape & Arhiv kod</span>
          </button>

          {/* Beta Pilot Info Button */}
          <button
            type="button"
            onClick={onOpenPricing}
            className="px-3.5 py-2 bg-[#0066CC] hover:bg-[#0052A3] text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>Beta program</span>
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
              <span>Prijava</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
