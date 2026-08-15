import React, { useState, useRef, useEffect } from 'react';
import QRCodeStyling, { DotType, CornerSquareType, CornerDotType, Options } from 'qr-code-styling';
import confetti from 'canvas-confetti';
import { 
  FolderCategory, 
  ModuleType, 
  QrStyleConfig, 
  UserTier, 
  DotStyle, 
  QrRecord,
  VideoData 
} from '../types';
import { syncRecordToSupabase } from '../lib/supabase';
import { 
  Save, 
  Download, 
  Smartphone, 
  Lock, 
  Sparkles, 
  Palette, 
  CheckCircle2, 
  Copy, 
  BarChart3, 
  FolderGit2, 
  UploadCloud,
  ChevronDown,
  Video,
  Utensils,
  Wifi
} from 'lucide-react';

const getQrOptions = (
  value: string,
  style: QrStyleConfig,
  isPremium: boolean
): Options => {
  let dotType: DotType = 'square';
  let cornerSquareType: CornerSquareType = 'square';
  let cornerDotType: CornerDotType = 'square';

  const s = (style.dotsStyle || '').toLowerCase();
  if (s.includes('zaoblj') || s.includes('round')) {
    dotType = 'rounded';
    cornerSquareType = 'extra-rounded';
    cornerDotType = 'dot';
  } else if (s.includes('pikč') || s.includes('pikc') || s.includes('dot')) {
    dotType = 'dots';
    cornerSquareType = 'dot';
    cornerDotType = 'dot';
  } else if (s.includes('prestiz') || s.includes('prestiž') || s.includes('classy')) {
    dotType = 'classy-rounded';
    cornerSquareType = 'extra-rounded';
    cornerDotType = 'dot';
  } else {
    dotType = 'square';
    cornerSquareType = 'square';
    cornerDotType = 'square';
  }

  return {
    width: style.size || 220,
    height: style.size || 220,
    type: 'canvas',
    data: value || 'https://auronio.com',
    image: isPremium && style.logoUrl ? style.logoUrl : undefined,
    margin: 4,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: 'H',
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.3,
      margin: 4,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      color: style.fgColor || '#1D1D1F',
      type: dotType,
    },
    backgroundOptions: {
      color: style.bgColor || '#FFFFFF',
    },
    cornersSquareOptions: {
      color: style.fgColor || '#1D1D1F',
      type: cornerSquareType,
    },
    cornersDotOptions: {
      color: style.fgColor || '#1D1D1F',
      type: cornerDotType,
    },
  };
};

interface PreviewTerminalProps {
  activeModule: ModuleType;
  payloadString: string;
  moduleData: any;
  userTier: UserTier;
  onOpenMobilePreview: () => void;
  onOpenAnalytics: () => void;
  onOpenPricing: () => void;
  customFolders?: string[];
  qrStyle?: QrStyleConfig;
  onStyleChange?: (style: QrStyleConfig) => void;
}

export const PreviewTerminal: React.FC<PreviewTerminalProps> = ({
  activeModule,
  payloadString,
  moduleData,
  userTier,
  onOpenMobilePreview,
  onOpenAnalytics,
  onOpenPricing,
  customFolders,
  qrStyle: externalQrStyle,
  onStyleChange,
}) => {
  // Folder Command Center state
  const [selectedFolder, setSelectedFolder] = useState<FolderCategory>('Glavna mapa');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // QR Customizer state (fallback to local if external is not supplied)
  const [internalQrStyle, setInternalQrStyle] = useState<QrStyleConfig>({
    fgColor: '#1D1D1F',
    bgColor: '#FFFFFF',
    dotsStyle: 'Zaobljene',
    logoUrl: null,
    size: 220,
  });

  const qrStyle = externalQrStyle ?? internalQrStyle;

  const handleUpdateStyle = (newStyle: QrStyleConfig) => {
    setInternalQrStyle(newStyle);
    onStyleChange?.(newStyle);
  };

  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const isPremiumOrEnterprise = userTier === 'premium' || userTier === 'enterprise';

  const availableFolders = React.useMemo(() => {
    const defaults = ['Glavna mapa', 'Trženjske kampanje 📈', 'Dogodki 🎟️', 'Restavracije & Meniji 🍽️'];
    if (!customFolders || customFolders.length === 0) return defaults;
    const combined = Array.from(new Set(['Glavna mapa', ...customFolders]));
    return combined;
  }, [customFolders]);

  // Effective payload value
  const effectivePayload = React.useMemo(() => {
    if (activeModule === 'url' && moduleData) {
      const uData = moduleData as any;
      if (uData.pathType === 'static') {
        return uData.url || 'https://auronio.com';
      }
      const rawSlug = uData.customSlug || uData.slug || 'predloga';
      const cleanSlug = rawSlug.startsWith('/') ? rawSlug : `/r/${rawSlug}`;
      return `https://auronio.com${cleanSlug}`;
    }
    if (activeModule === 'menu' && moduleData) {
      const mData = moduleData as any;
      const rawSlug = mData.slug || 'meni';
      const cleanSlug = rawSlug.startsWith('/') ? rawSlug : `/r/${rawSlug}`;
      return `https://auronio.com${cleanSlug}`;
    }
    if (activeModule === 'wifi' && moduleData) {
      const wData = moduleData as any;
      const pass = wData.encryption === 'nopass' ? '' : (wData.password || '');
      return `WIFI:S:${wData.ssid || ''};T:${wData.encryption || 'WPA'};P:${pass};;`;
    }
    if (activeModule === 'video' && moduleData) {
      const vData = moduleData as any;
      return vData?.ctaUrl || vData?.destinationUrl || vData?.videoUrl || vData?.url || payloadString || 'https://auronio.com';
    }
    return payloadString || 'https://auronio.com';
  }, [activeModule, payloadString, moduleData]);

  // Real-time QR Code Styling canvas initialization and update loop
  useEffect(() => {
    const options = getQrOptions(effectivePayload, qrStyle, isPremiumOrEnterprise);
    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling(options);
      if (qrContainerRef.current) {
        qrContainerRef.current.innerHTML = '';
        qrCodeRef.current.append(qrContainerRef.current);
      }
    } else {
      qrCodeRef.current.update(options);
    }
  }, [effectivePayload, qrStyle, isPremiumOrEnterprise]);

  // Download PNG
  const handleDownloadPng = async () => {
    const fileName = `Auronio_${customTitle ? customTitle.replace(/\s+/g, '_') : activeModule}_QR`;
    if (qrCodeRef.current) {
      await qrCodeRef.current.download({ name: fileName, extension: 'png' });
    } else {
      const canvas = qrContainerRef.current?.querySelector('canvas');
      if (!canvas) return;
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.download = `${fileName}.png`;
      a.href = url;
      a.click();
    }
  };

  // Download Vector SVG
  const handleDownloadSvg = async () => {
    const fileName = `Auronio_${customTitle ? customTitle.replace(/\s+/g, '_') : activeModule}_QR`;
    if (qrCodeRef.current) {
      await qrCodeRef.current.download({ name: fileName, extension: 'svg' });
    }
  };

  // Handle Save to Supabase
  const handleSaveRecord = async () => {
    if (!customTitle.trim()) {
      setSyncFeedback({
        type: 'error',
        message: 'Prosimo, vnesite naslov QR kode pred shranjevanjem.',
      });
      setTimeout(() => setSyncFeedback(null), 3500);
      return;
    }

    setIsSyncing(true);
    setSyncFeedback(null);

    const record: QrRecord = {
      id: 'qr_' + Date.now(),
      title: customTitle.trim(),
      folder: selectedFolder,
      moduleType: activeModule,
      payload: effectivePayload,
      data: moduleData,
      style: qrStyle,
      userTier: userTier,
      createdAt: new Date().toISOString(),
      scanCount: Math.floor(Math.random() * 25) + 1,
    };

    const result = await syncRecordToSupabase(record);

    setIsSyncing(false);
    if (result.success) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });

      setSyncFeedback({
        type: 'success',
        message: result.message,
      });

      setTimeout(() => setSyncFeedback(null), 4500);
    }
  };

  // Copy Payload String
  const handleCopyPayload = () => {
    navigator.clipboard.writeText(effectivePayload);
    setSyncFeedback({
      type: 'success',
      message: 'Vsebina uspešno kopirana v odložišče!',
    });
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  return (
    <div className="sticky top-6 space-y-6">
      {/* Main Terminal Card */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-sm space-y-6">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900">
              PREDOGLED IN PRENOS
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAnalytics}
              className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all flex items-center gap-1"
              title="Opremljeno z analitiko"
            >
              <BarChart3 className="w-3.5 h-3.5 text-slate-700" />
              Statistika
            </button>
          </div>
        </div>

        {/* Live Canvas Box */}
        <div className="flex flex-col items-center justify-center p-6 bg-[#F5F5F7] rounded-2xl border border-slate-200/60 relative group">
          <div className="p-4 bg-white rounded-2xl shadow-md border border-slate-200/70 transition-transform group-hover:scale-[1.02] duration-300">
            <div ref={qrContainerRef} className="flex items-center justify-center overflow-hidden" />
          </div>

          <p className="text-[11px] text-slate-500 mt-4 text-center font-mono max-w-xs truncate" title={effectivePayload}>
            {effectivePayload.length > 35 ? effectivePayload.slice(0, 35) + '...' : effectivePayload}
          </p>

          {activeModule === 'video' && (
            <button
              type="button"
              onClick={onOpenMobilePreview}
              className="w-full mt-3 py-2.5 px-4 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Video className="w-4 h-4" />
              Poglej pristajalno stran videa
            </button>
          )}

          {activeModule === 'menu' && (
            <button
              type="button"
              onClick={onOpenMobilePreview}
              className="w-full mt-3 py-2.5 px-4 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Utensils className="w-4 h-4" />
              Poglej digitalni meni & PDF
            </button>
          )}

          {activeModule === 'wifi' && (
            <button
              type="button"
              onClick={onOpenMobilePreview}
              className="w-full mt-3 py-2.5 px-4 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Wifi className="w-4 h-4" />
              Predogled Wi-Fi povezave
            </button>
          )}

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={onOpenMobilePreview}
              className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Smartphone className="w-3.5 h-3.5 text-slate-700" />
              Predogled na telefonu
            </button>

            <button
              type="button"
              onClick={handleCopyPayload}
              className="p-1.5 text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-xs"
              title="Kopiraj niz"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* FOLDER COMMAND CENTER */}
        <div className="p-4 bg-slate-50/90 border border-slate-200/80 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <FolderGit2 className="w-4 h-4 text-[#0066CC]" />
              SHRANI V NADZORNO PLOŠČO
            </h4>
            <span className="text-[10px] font-medium text-slate-500">Varno shranjevanje</span>
          </div>

          {/* Folder Selector Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Izberite mapo
            </label>
            <div className="relative">
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value as FolderCategory)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-8 shadow-xs cursor-pointer"
              >
                {availableFolders.map((fName) => (
                  <option key={fName} value={fName}>
                    {fName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Custom Title Input & Save Button */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Naslov QR kode ali koda kampanje
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="npr. Poletni meni - Terasa"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />

              <button
                type="button"
                onClick={handleSaveRecord}
                disabled={isSyncing}
                className="px-4 py-2 bg-[#0066CC] hover:bg-[#0052A3] text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-sm disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5 text-blue-100" />
                {isSyncing ? 'Shranjevanje...' : 'Shrani'}
              </button>
            </div>
          </div>

          {/* Feedback message */}
          {syncFeedback && (
            <div
              className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                syncFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              {syncFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              )}
              <span>{syncFeedback.message}</span>
            </div>
          )}
        </div>

        {/* Download Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleDownloadPng}
            className="w-full py-3 px-4 bg-[#0066CC] hover:bg-[#0052A3] text-white text-xs font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4 text-blue-100" />
            Prenesi PNG
          </button>

          <button
            type="button"
            onClick={handleDownloadSvg}
            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold rounded-2xl border border-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-600" />
            Prenesi Vector SVG
          </button>
        </div>
      </div>

      {/* QR STYLING & PREMIUM CUSTOMIZATION ACCORDION / CONTAINER */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-slate-700" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Oblikovanje & Podoba & Stil (CGP)
            </h4>
          </div>
          {!isPremiumOrEnterprise && (
            <button
              onClick={onOpenPricing}
              className="text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full border border-blue-200 transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-blue-600" />
              Auronio Beta
            </button>
          )}
        </div>

        {/* Basic Colors */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Barva spredaj (Foreground)
            </label>
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <input
                type="color"
                value={qrStyle.fgColor}
                onChange={(e) => handleUpdateStyle({ ...qrStyle, fgColor: e.target.value })}
                className="w-7 h-7 rounded-lg cursor-pointer border-none bg-transparent"
              />
              <span className="text-xs font-mono text-slate-700">{qrStyle.fgColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Barva ozadja (Background)
            </label>
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <input
                type="color"
                value={qrStyle.bgColor}
                onChange={(e) => handleUpdateStyle({ ...qrStyle, bgColor: e.target.value })}
                className="w-7 h-7 rounded-lg cursor-pointer border-none bg-transparent"
              />
              <span className="text-xs font-mono text-slate-700">{qrStyle.bgColor}</span>
            </div>
          </div>
        </div>

        {/* DOT STYLES (Zaobljene, Pikčaste, Prestižne) */}
        <div className="relative">
          <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
            Struktura pik (Zaobljene, Pikčaste, Prestižne)
          </label>

          <div className="grid grid-cols-3 gap-2">
            {(['Zaobljene', 'Pikčaste', 'Prestižne'] as DotStyle[]).map((styleName) => (
              <button
                key={styleName}
                type="button"
                onClick={() => handleUpdateStyle({ ...qrStyle, dotsStyle: styleName })}
                className={`py-2 px-2 text-xs font-medium rounded-xl border transition-all ${
                  qrStyle.dotsStyle === styleName
                    ? 'bg-[#0066CC] text-white border-[#0066CC] font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {styleName}
              </button>
            ))}
          </div>
        </div>

        {/* LOGO UPLOAD ZONE */}
        <div className="relative">
          <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
            Logotip podjetja na sredini QR kode
          </label>

          <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/60 text-center space-y-2">
            <UploadCloud className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-600 font-medium">
              Vnesite URL naslov slike logotipa (PNG/SVG)
            </p>
            <input
              type="text"
              placeholder="https://auronio.com/logo.png"
              value={qrStyle.logoUrl || ''}
              onChange={(e) => handleUpdateStyle({ ...qrStyle, logoUrl: e.target.value || null })}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
