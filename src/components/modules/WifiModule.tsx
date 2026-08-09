import React, { useState } from 'react';
import { WifiData } from '../../types';
import { Wifi, Lock, Eye, EyeOff, ShieldCheck, Info } from 'lucide-react';

interface WifiModuleProps {
  data: WifiData;
  onChange: (updated: WifiData) => void;
}

export const WifiModule: React.FC<WifiModuleProps> = ({ data, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200/80">
        <div className="flex items-center gap-2">
          <Wifi className="w-5 h-5 text-stone-700" />
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-semibold text-[#1D1D1F]">Brezžično omrežje</h3>
            <div className="relative group/info inline-block">
              <Info className="w-4 h-4 text-slate-400 hover:text-blue-600 inline-block cursor-help transition-colors" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/info:block w-72 p-3 bg-slate-900 text-white text-[11px] leading-relaxed rounded-xl shadow-xl border border-slate-700 z-50 pointer-events-none transition-all text-center">
                Gostje bodo ob skenu te QR kode avtomatsko povezani na vaš Wi-Fi, brez ročnega prepisovanja gesla.
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
              </div>
            </div>
          </div>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
          Modul 5/5
        </span>
      </div>

      <p className="text-xs text-stone-600">
        Obiskovalcem in strankam omogočite hitro samodejno povezavo na vaše Wi-Fi omrežje brez ročnega tipkanja gesla.
      </p>

      {/* Main Form Fields Container */}
      <div className="p-5 bg-stone-50/80 border border-stone-200/90 rounded-2xl space-y-5">
        
        {/* FIELD 1: IME OMREŽJA (SSID) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-stone-600" />
            IME OMREŽJA (SSID)
          </label>
          <input
            type="text"
            value={data.ssid}
            onChange={(e) => onChange({ ...data, ssid: e.target.value })}
            placeholder="npr. Auronio_Gostje"
            className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-[#1D1D1F] font-mono font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-xs"
          />
          <p className="text-[11px] text-stone-500 mt-1">
            Vnesite natančno ime vašega Wi-Fi omrežja, kot ga vidijo naprave ob iskanju.
          </p>
        </div>

        {/* FIELD 2: VRSTA ZAŠČITE (ENCRYPTION) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
            VRSTA ZAŠČITE (ENCRYPTION)
          </label>
          <select
            value={data.encryption}
            onChange={(e) => onChange({ ...data, encryption: e.target.value as any })}
            className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-[#1D1D1F] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-xs cursor-pointer"
          >
            <option value="WPA">WPA/WPA2</option>
            <option value="WEP">WEP</option>
            <option value="nopass">Brez zaščite (Open)</option>
          </select>
        </div>

        {/* FIELD 3: GESLO OMREŽJA */}
        {data.encryption !== 'nopass' && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-stone-600" />
              GESLO OMREŽJA
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={data.password}
                onChange={(e) => onChange({ ...data, password: e.target.value })}
                placeholder="Vnesite geslo za Wi-Fi"
                className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-[#1D1D1F] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/40 pr-10 shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors"
                title={showPassword ? 'Skrij geslo' : 'Prikaži geslo'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Hidden SSID Option */}
        <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold text-stone-800">Skrito omrežje (Hidden SSID)</h4>
            <p className="text-[11px] text-stone-500">
              Omogočite le, če vaše omrežje ne oddaja javnega imena.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={data.hidden}
              onChange={(e) => onChange({ ...data, hidden: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066CC]"></div>
          </label>
        </div>

      </div>
    </div>
  );
};

