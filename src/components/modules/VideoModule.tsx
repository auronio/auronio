import React from 'react';
import { VideoData } from '../../types';
import { Video, Play, Link, Type, MousePointerClick, CheckCircle2, Sparkles, Info } from 'lucide-react';

interface VideoModuleProps {
  data: VideoData;
  onChange: (data: VideoData) => void;
}

const PRESET_CTA_TEXTS = [
  'Obišči trgovino',
  'Kupi izdelek',
  'Prijavi se',
  'Rezerviraj mesto',
  'Več informacij',
];

export const VideoModule: React.FC<VideoModuleProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066CC] flex items-center justify-center">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Video vsebine</h3>
            <p className="text-[11px] text-slate-500">Predstavitveni videoposnetki z interaktivnim pozivom k akciji</p>
          </div>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          Modul 6/6
        </span>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        Promovirajte vaša video gradiva, predstavitve izdelkov ali spletne tečaje z neposrednim predvajanjem in prilagojenim CTA gumbom za pretvorbo obiskovalcev.
      </p>

      {/* FIELD 1: POVEZAVA DO VIDEOPOSNETKA */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Play className="w-3.5 h-3.5 text-[#0066CC]" />
          Povezava do videoposnetka
          <div className="group relative inline-flex items-center ml-1">
            <Info className="w-4 h-4 text-slate-400 hover:text-blue-600 transition-colors cursor-help" />
            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 w-64 p-2.5 bg-slate-900/95 backdrop-blur-xs text-white text-[11px] font-normal normal-case leading-relaxed rounded-xl shadow-xl border border-slate-800">
              Prilepite povezavo do videa (YouTube/Vimeo/TikTok). Video se bo predvajal na vaši Auronio mobilni pristajalni strani, ki jo preverite s klikom na gumb 'Poglej pristajalno stran' pod kodo.
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
            </div>
          </div>
        </label>
        <div className="relative">
          <input
            type="url"
            value={data.videoUrl}
            onChange={(e) => onChange({ ...data, videoUrl: e.target.value })}
            placeholder="Prilepite YouTube, Vimeo ali TikTok URL povezavo"
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono shadow-xs"
          />
        </div>
        <p className="text-[11px] text-slate-500">
          Podpira YouTube (npr. youtube.com ali youtu.be), Vimeo ter TikTok predvajalnike.
        </p>
      </div>

      {/* FIELD 2: NASLOV IN OPIS PRISTAJALNE STRANI */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-[#0066CC]" />
          Naslov in opis pristajalne strani
          <div className="group relative inline-flex items-center ml-1">
            <Info className="w-4 h-4 text-slate-400 hover:text-blue-600 transition-colors cursor-help" />
            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 w-64 p-2.5 bg-slate-900/95 backdrop-blur-xs text-white text-[11px] font-normal normal-case leading-relaxed rounded-xl shadow-xl border border-slate-800">
              Vnesite naslov in privlačen opis vašega izdelka ali storitve. Ta vsebina se bo prikazala neposredno pod video predvajalnikom na zaslonu mobilnega telefona vaše stranke.
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
            </div>
          </div>
        </label>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Naslov videa / predstavitve
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder="Ekskluzivna predstavitev nove kolekcije Auronio"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Opis in podrobnosti vsebine
          </label>
          <textarea
            rows={3}
            value={data.description}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            placeholder="Oglejte si kratek predstavitveni video in odkrijte ključne novosti ter posebne ugodnosti..."
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

      </div>

      {/* FIELD 3: POZIV K AKCIJI (CTA GUMB) */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <MousePointerClick className="w-3.5 h-3.5 text-[#0066CC]" />
          Poziv k akciji (CTA gumb)
        </label>

        {/* Preset chips */}
        <div>
          <span className="block text-[11px] font-semibold text-slate-600 mb-1.5">
            Hitri predlogi besedila gumba:
          </span>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {PRESET_CTA_TEXTS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onChange({ ...data, ctaText: preset })}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-all ${
                  data.ctaText === preset
                    ? 'bg-[#0066CC] text-white border-[#0066CC] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Poljubno besedilo CTA gumba
          </label>
          <input
            type="text"
            value={data.ctaText}
            onChange={(e) => onChange({ ...data, ctaText: e.target.value })}
            placeholder="Obišči trgovino"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
            Ciljna URL povezava gumba (Cilj po kliku)
            <div className="group relative inline-flex items-center ml-1">
              <Info className="w-4 h-4 text-slate-400 hover:text-blue-600 transition-colors cursor-help" />
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 w-64 p-2.5 bg-slate-900/95 backdrop-blur-xs text-white text-[11px] font-normal normal-case leading-relaxed rounded-xl shadow-xl border border-slate-800">
                Vpišite spletni naslov (npr. vašo spletno trgovino), kamor želite usmeriti kupca. To je končni cilj, kamor stranka klikne po ogledu vašega predstavitvenega videa.
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
              </div>
            </div>
          </label>
          <div className="relative">
            <input
              type="url"
              value={data.ctaUrl}
              onChange={(e) => onChange({ ...data, ctaUrl: e.target.value })}
              placeholder="https://auronio.com/trgovina"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
