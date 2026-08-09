import React from 'react';
import { ModuleType, LinktreeData, MenuData, VCardData, WifiData, UrlData } from '../types';
import { 
  X, 
  Instagram, 
  Facebook, 
  MessageCircle, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  ExternalLink, 
  Wifi, 
  Download, 
  FileText,
  Lock,
  RefreshCw,
  ShieldCheck,
  Utensils,
  BookOpen,
  ArrowUpRight,
  Clock
} from 'lucide-react';

interface MobilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule?: ModuleType;
  moduleData?: any;
  videoUrl?: string;
  ctaText?: string;
  destinationUrl?: string;
}

const getEmbedUrl = (url: any): string => {
  const str = (url || "").toString();
  if (str.includes("vimeo.com")) {
    const id = str.split("/").pop();
    return `https://player.vimeo.com/video/${id}`;
  }
  if (str.includes("youtu.be")) {
    const id = str.split("/").pop()?.split("?")[0];
    return `https://www.youtube-nocookie.com/embed/${id}`;
  }
  if (str.includes("youtube.com")) {
    const id = str.split("v=")[1]?.split("&")[0];
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : "https://www.youtube-nocookie.com/embed/P59wQ4SXtsg";
  }
  return "https://www.youtube-nocookie.com/embed/P59wQ4SXtsg";
};

export const MobilePreviewModal: React.FC<MobilePreviewModalProps> = ({
  isOpen,
  onClose,
  activeModule = 'url',
  moduleData,
  videoUrl,
  ctaText,
  destinationUrl,
}) => {
  if (!isOpen) return null;

  const isVideo = activeModule === 'video';

  const vUrl = videoUrl || moduleData?.videoUrl || moduleData?.url || 'https://youtu.be/P59wQ4SXtsg';
  const cText = ctaText || moduleData?.ctaText || moduleData?.buttonText || 'Obišči trgovino';
  const destUrl = destinationUrl || moduleData?.ctaUrl || moduleData?.destinationUrl || 'https://auronio.com';
  const titleText = moduleData?.title || moduleData?.name || 'Predstavitveni video';
  const descText = moduleData?.description || 'Napredne pametne QR kode';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-[360px] h-[640px] rounded-[40px] border-8 border-slate-800 bg-white p-6 shadow-2xl relative flex flex-col justify-between overflow-hidden">
        {/* Header of Phone */}
        <div>
          <div className="w-28 h-4 bg-slate-900 rounded-full mx-auto shrink-0 mb-3" />
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
            >
              ← Nazaj
            </button>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {activeModule === 'url' ? 'Spletni predogled' : 'Predogled'}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Zapri"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Browser Address Bar for URL module */}
          {activeModule === 'url' && (
            <div className="bg-slate-100 border border-slate-200/90 rounded-2xl px-3 py-2 flex items-center justify-between gap-2 shadow-inner mb-3">
              <div className="flex items-center gap-1.5 text-slate-500 overflow-hidden min-w-0">
                <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-mono text-slate-800 truncate font-medium">
                  {(moduleData as UrlData)?.url || 'https://auronio.com'}
                </span>
              </div>
              <RefreshCw className="w-3.5 h-3.5 text-slate-400 shrink-0 cursor-pointer hover:text-slate-600 transition-colors" />
            </div>
          )}
        </div>

        {/* Content Stack (Center Block) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs font-sans flex flex-col">
          {isVideo ? (
            <div className="space-y-4 pt-1">
              {/* Embedded Video Player */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-md border border-slate-800 bg-black">
                <iframe
                  src={getEmbedUrl(vUrl)}
                  title={titleText}
                  className="w-full h-full border-0 rounded-lg shadow-sm"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video Title & Description */}
              <div className="text-left space-y-1 bg-slate-50 p-3.5 border border-slate-200 rounded-2xl">
                <h4 className="font-bold text-xs text-slate-900">
                  {titleText}
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {descText}
                </p>
              </div>
            </div>
          ) : activeModule === 'url' ? (
            <div className="flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between my-auto relative p-4">
              <div className="space-y-3 my-auto text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#0066CC] flex items-center justify-center mx-auto shadow-xs border border-blue-200/60">
                  <Globe className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Ciljna spletna stran
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Pametna QR koda usmerja obiskovalca naravnost na vaš naslov.
                  </p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs text-left space-y-1 font-mono text-[11px]">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aktivna povezava:</div>
                  <div className="text-[#0066CC] font-bold break-all">
                    {(moduleData as UrlData)?.url || 'https://auronio.com'}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-emerald-700 font-semibold bg-emerald-50 py-1.5 px-3 rounded-xl border border-emerald-200/70">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Varno šifrirana SSL preusmeritev (200 OK)</span>
                </div>
              </div>

              <div className="pt-3 space-y-2">
                <a
                  href={(moduleData as UrlData)?.url || 'https://auronio.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all text-center"
                >
                  <span>Testiraj povezavo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <p className="text-[10px] text-center text-slate-400 font-medium">
                  Auronio Smart Router • Neposredna preusmeritev
                </p>
              </div>
            </div>
          ) : activeModule === 'linktree' ? (
            <div className="text-center space-y-4 pt-2">
              <div className="w-20 h-20 rounded-full mx-auto overflow-hidden bg-slate-200 border-2 border-white shadow-md">
                <img
                  src={(moduleData as LinktreeData)?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {(moduleData as LinktreeData)?.title || 'Auronio Profile'}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  {(moduleData as LinktreeData)?.bio || 'Dobrodošli na uradni strani.'}
                </p>
              </div>

              <div className="flex justify-center gap-3 py-2">
                {(moduleData as LinktreeData)?.instagram && (
                  <a href={(moduleData as LinktreeData).instagram} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {(moduleData as LinktreeData)?.facebook && (
                  <a href={(moduleData as LinktreeData).facebook} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {(moduleData as LinktreeData)?.whatsapp && (
                  <a href={(moduleData as LinktreeData).whatsapp} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="space-y-2 pt-2">
                {(moduleData as LinktreeData)?.customLinks?.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full py-3 px-4 bg-white border border-slate-200 rounded-2xl font-semibold text-xs text-slate-900 shadow-xs text-center hover:bg-slate-50"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ) : activeModule === 'menu' ? (
            <div className="space-y-3.5 pt-1">
              {/* Luxury Restaurant Header Card */}
              <div className="bg-stone-900 text-white p-4 rounded-2xl shadow-md space-y-2.5 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="w-10 h-10 rounded-xl bg-stone-800 text-amber-400 flex items-center justify-center mx-auto border border-stone-700">
                  <Utensils className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-white tracking-tight">
                    {(moduleData as MenuData)?.restaurantName || 'Restavracija Center - Letni Meni'}
                  </h3>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    {(moduleData as MenuData)?.subtitle || 'Vrhunska mediteranska kuhinja & slovenska vina'}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                    <Clock className="w-3 h-3" /> Odprto • 10:00 - 23:00
                  </span>
                </div>

                {/* PDF Catalog CTA Button */}
                <a
                  href={(moduleData as MenuData)?.pdfUrl || 'https://auronio.com/katalog.pdf'}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all text-center block"
                >
                  <BookOpen className="w-4 h-4 text-stone-950" />
                  <span>Odpri ali prenesi PDF katalog</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-950" />
                </a>
              </div>

              {/* Vector Category Pill Selector */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px] font-bold text-stone-600">
                <span className="px-3 py-1 bg-stone-900 text-white rounded-full shrink-0">Vse jedi</span>
                <span className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full shrink-0 border border-stone-200">Glavne jedi</span>
                <span className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full shrink-0 border border-stone-200">Dnevno kosilo</span>
                <span className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full shrink-0 border border-stone-200">Sladice</span>
                <span className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full shrink-0 border border-stone-200">Vinska karta</span>
              </div>

              {/* Scrolling List of Items */}
              <div className="space-y-2.5">
                {((moduleData as MenuData)?.items?.length ? (moduleData as MenuData).items : [
                  {
                    id: 'm1',
                    name: 'File divjega brancina na mladi špinači',
                    price: '22.00 €',
                    description: 'Pripravljeno na oljčnem olju, dodan pečen krompir s koromačem.',
                    badge: 'Hišna specialiteta'
                  },
                  {
                    id: 'm2',
                    name: 'Domači istrski fuži s črnimi tartufi',
                    price: '18.50 €',
                    description: 'Sveža testenina, smetanova omaka, sveže naribani slovenski tartufi.',
                    badge: 'Dnevno kosilo'
                  },
                  {
                    id: 'm3',
                    name: 'Čokoladni fondant z gozdnimi sadeži',
                    price: '7.00 €',
                    description: 'Toplo čokoladno jedro, vanilijev sladoled z medom.',
                    badge: 'Sladice'
                  }
                ])?.map((item) => (
                  <div key={item.id} className="p-3 bg-white border border-stone-200 rounded-2xl shadow-2xs space-y-1 hover:border-amber-400 transition-colors">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-xs text-stone-900 leading-snug">{item.name}</span>
                      <span className="font-black text-xs text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">{item.price}</span>
                    </div>
                    <p className="text-[10px] text-stone-500 leading-relaxed">{item.description}</p>
                    {item.badge && (
                      <span className="inline-block px-2 py-0.5 bg-stone-100 text-stone-700 text-[9px] font-bold rounded-md border border-stone-200/80 mt-1">
                        {item.badge}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom PDF Download Card */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-1.5">
                <p className="text-[10px] font-semibold text-amber-900">
                  Želite celoten natisnjen jedilnik na telefonu?
                </p>
                <a
                  href={(moduleData as MenuData)?.pdfUrl || 'https://auronio.com/katalog.pdf'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-stone-900 text-white rounded-xl text-[11px] font-bold w-full"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Prenesi PDF katalog ({(moduleData as MenuData)?.pdfFileSize || '2.4 MB'})</span>
                </a>
              </div>
            </div>
          ) : activeModule === 'vcard' ? (
            <div className="space-y-4 pt-2">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-2 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-slate-900 text-white mx-auto flex items-center justify-center font-bold text-lg">
                  {(moduleData as VCardData)?.firstName?.[0]}
                  {(moduleData as VCardData)?.lastName?.[0]}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {(moduleData as VCardData)?.firstName} {(moduleData as VCardData)?.lastName}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {(moduleData as VCardData)?.position} • {(moduleData as VCardData)?.company}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {(moduleData as VCardData)?.phone && (
                  <div className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl">
                    <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{(moduleData as VCardData).phone}</span>
                  </div>
                )}
                {(moduleData as VCardData)?.email && (
                  <div className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl">
                    <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{(moduleData as VCardData).email}</span>
                  </div>
                )}
                {(moduleData as VCardData)?.website && (
                  <div className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl">
                    <Globe className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{(moduleData as VCardData).website}</span>
                  </div>
                )}
                {(moduleData as VCardData)?.location && (
                  <div className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl">
                    <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{(moduleData as VCardData).location}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="w-full py-3 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <Download className="w-3.5 h-3.5 text-blue-100" /> Shrani kontakt v telefon
              </button>
            </div>
          ) : activeModule === 'wifi' ? (
            <div className="space-y-4 pt-2">
              {/* Mock iOS / Android System Connection Prompt Screen */}
              <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-lg text-center space-y-4 border-t-4 border-t-[#0066CC]">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0066CC] flex items-center justify-center mx-auto border border-blue-100 shadow-xs">
                  <Wifi className="w-7 h-7" />
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-[10px] uppercase tracking-wider text-stone-400">
                    Sistemsko Wi-Fi obvestilo
                  </h4>
                  <h3 className="font-extrabold text-sm text-stone-900 leading-snug px-1">
                    Ali se želite povezati v omrežje {(moduleData as WifiData)?.ssid || 'Auronio_Gostje'}?
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Avtomatska varna povezava brez ročnega vnašanja gesla.
                  </p>
                </div>

                {/* Security Info Card */}
                <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-xl text-left space-y-1.5 text-[11px]">
                  <div className="flex justify-between items-center text-stone-600">
                    <span>Zaščita omrežja:</span>
                    <span className="font-bold font-mono text-stone-900">
                      {(moduleData as WifiData)?.encryption === 'nopass'
                        ? 'Brez zaščite (Odprto)'
                        : (moduleData as WifiData)?.encryption === 'WEP'
                        ? 'WEP'
                        : 'WPA/WPA2'}
                    </span>
                  </div>
                  {(moduleData as WifiData)?.encryption !== 'nopass' && (
                    <div className="flex justify-between items-center text-stone-600 border-t border-stone-200/60 pt-1.5">
                      <span>Varnostno geslo:</span>
                      <span className="font-mono text-stone-800 font-semibold">
                        {(moduleData as WifiData)?.password ? '••••••••' : 'Ni gesla'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Royal Blue Action Button */}
                <button
                  type="button"
                  onClick={() => alert(`Povezovanje v omrežje: ${(moduleData as WifiData)?.ssid || 'Auronio_Gostje'}... Uspešno!`)}
                  className="w-full py-3 bg-[#0066CC] hover:bg-[#0052A3] active:scale-[0.98] text-white font-bold rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Wifi className="w-4 h-4 text-white" />
                  <span>Poveži se</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="text-[11px] font-semibold text-stone-400 hover:text-stone-600 transition-colors block w-full text-center"
                >
                  Prekliči
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 pt-8">
              <Globe className="w-12 h-12 text-[#0066CC] mx-auto" />
              <h3 className="font-bold text-sm text-slate-900">Preusmeritev na spletno mesto</h3>
              <p className="text-xs font-mono text-slate-600 p-3 bg-white border border-slate-200 rounded-2xl break-all">
                {(moduleData as UrlData)?.url || 'https://auronio.com'}
              </p>
              <a
                href={(moduleData as UrlData)?.url || 'https://auronio.com'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-3 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold rounded-2xl text-xs transition-colors"
              >
                Odpri povezavo <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Footer Action Area (Bottom Block) */}
        {isVideo && (
          <div className="pt-3 border-t border-slate-100 shrink-0">
            <a
              href={destUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-[#0066CC] hover:bg-[#0052A3] text-white py-3 px-6 rounded-xl font-medium text-center shadow-md w-full block transition-colors"
            >
              {cText}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
