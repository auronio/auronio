import React from 'react';
import { ShieldCheck, Lock, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#0066CC] text-white flex items-center justify-center font-black text-xs shadow-xs">
              A
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight">AURONIO</span>
            <span>• auronio.com</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> GDPR Skladno
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-500" /> 256-bit Šifriranje
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-[#0066CC]" /> EU Strežniki
            </span>
          </div>
        </div>

        {/* Required Legal Label Footer */}
        <div className="pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 font-medium">
            © Auronio. Vse pravice pridržane. Gostovano v Evropski uniji v skladu s strogimi standardi GDPR.
          </p>
        </div>
      </div>
    </footer>
  );
};
