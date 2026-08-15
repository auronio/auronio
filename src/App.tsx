import React, { useState, useMemo } from 'react';
import { 
  ModuleType, 
  UserTier, 
  UrlData, 
  LinktreeData, 
  MenuData, 
  VCardData, 
  WifiData, 
  VideoData,
  QrRecord,
  AuthUser,
  QrStyleConfig
} from './types';
import { Header } from './components/Header';
import { UrlModule } from './components/modules/UrlModule';
import { LinktreeModule } from './components/modules/LinktreeModule';
import { MenuModule } from './components/modules/MenuModule';
import { VCardModule } from './components/modules/VCardModule';
import { WifiModule } from './components/modules/WifiModule';
import { VideoModule } from './components/modules/VideoModule';
import { PreviewTerminal } from './components/PreviewTerminal';
import { PricingGrid } from './components/PricingGrid';
import { EnterpriseModal } from './components/EnterpriseModal';
import { MobilePreviewModal } from './components/MobilePreviewModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { SavedRecordsDrawer } from './components/SavedRecordsDrawer';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

import { 
  Globe, 
  LayoutList, 
  Utensils, 
  Contact, 
  Wifi, 
  Video
} from 'lucide-react';

export default function App() {
  // Navigation & Tier State
  const [activeModule, setActiveModule] = useState<ModuleType>('url');
  const [userTier, setUserTier] = useState<UserTier>('premium'); // Full access enabled for the beta pilot preview

  // Shared Global Custom Folders State
  const [customFolders, setCustomFolders] = useState<string[]>([
    'Trženjske kampanje 📈',
    'Dogodki 🎟️',
    'Restavracije & Meniji 🍽️',
  ]);

  // Shared QR Customization Style State
  const [qrStyle, setQrStyle] = useState<QrStyleConfig>({
    fgColor: '#1D1D1F',
    bgColor: '#FFFFFF',
    dotsStyle: 'Zaobljene',
    logoUrl: null,
    size: 220,
  });

  // Modals & Auth state
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isEnterpriseModalOpen, setIsEnterpriseModalOpen] = useState<boolean>(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState<boolean>(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);

  // Module Forms State
  const [urlData, setUrlData] = useState<UrlData>({
    url: 'https://auronio.com/vsi-izdelki',
    pathType: 'dynamic',
    customSlug: 'poletna-ponudba',
  });

  const [linktreeData, setLinktreeData] = useState<LinktreeData>({
    title: 'Auronio Studio & Boutique',
    bio: 'Sodobne digitalne rešitve, pametne QR kode in prestižno oblikovanje.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    instagram: 'https://instagram.com/auronio_official',
    facebook: 'https://facebook.com/auronio.slovenia',
    whatsapp: 'https://wa.me/38641123456',
    customLinks: [
      { id: '1', label: 'Uradno spletno mesto', url: 'https://auronio.com' },
      { id: '2', label: 'E-trgovina in zbirke', url: 'https://auronio.com/trgovina' },
      { id: '3', label: 'Rezervacija sestanka', url: 'https://auronio.com/rezervacija' },
    ],
  });

  const [menuData, setMenuData] = useState<MenuData>({
    restaurantName: 'Restavracija Center - Letni Meni',
    subtitle: 'Vrhunska mediteranska kuhinja & slovenska vina',
    pdfUrl: 'https://auronio.com/katalog.pdf',
    pdfFileName: 'Jedilnik_Leto_2026.pdf',
    pdfFileSize: '2.4 MB',
    slug: 'meni',
    categories: ['Glavne jedi', 'Hladne predjedi', 'Sladice', 'Vinska karta'],
    items: [
      {
        id: '1',
        name: 'File divjega brancina na mladi špinači',
        price: '22.00 €',
        description: 'Pripravljeno na oljčnem olju, dodan pečen krompir s koromačem.',
        category: 'Glavne jedi',
        badge: 'Hišna specialiteta',
      },
      {
        id: '2',
        name: 'Domači istrski fuži s črnimi tartufi',
        price: '18.50 €',
        description: 'Sveža testenina, smetanova omaka, sveže naribani slovenski tartufi.',
        category: 'Glavne jedi',
        badge: 'Vegansko po želji',
      },
      {
        id: '3',
        name: 'Čokoladni fondant z gozdnimi sadeži',
        price: '7.00 €',
        description: 'Toplo čokoladno jedro, vanilijev sladoled z medom.',
        category: 'Sladice',
        badge: 'NOVO',
      },
    ],
  });

  const [vcardData, setVcardData] = useState<VCardData>({
    firstName: 'Marko',
    lastName: 'Novak',
    company: 'Auronio d.o.o.',
    position: 'Direktor razvoja & partnerstev',
    phone: '+386 41 123 456',
    email: 'marko.novak@auronio.com',
    website: 'https://auronio.com',
    location: 'Slovenska cesta 55, 1000 Ljubljana',
    enableCalendar: true,
    calendarNote: 'Rezervirajte uvodni sestanek preko Auronio sistema.',
    avatarUrl: '',
  });

  const [wifiData, setWifiData] = useState<WifiData>({
    ssid: 'Auronio_Gostje',
    password: 'GostVarnost!',
    encryption: 'WPA',
    hidden: false,
  });

  const [videoData, setVideoData] = useState<VideoData>({
    videoUrl: 'https://youtu.be/P59wQ4SXtsg',
    title: 'Ekskluzivna predstavitev Auronio',
    description: 'Napredne pametne QR kode',
    ctaText: 'Obišči spletno stran',
    ctaUrl: 'https://auronio.com',
    slug: '/predstavitev',
  });

  // Calculate payload string reactively based on active module data
  const payloadString = useMemo(() => {
    switch (activeModule) {
      case 'url': {
        if (urlData.pathType === 'static') {
          return urlData.url || 'https://auronio.com';
        }
        const rawSlug = urlData.customSlug || (urlData as any).slug || 'predloga';
        const cleanSlug = rawSlug.startsWith('/') ? rawSlug : `/r/${rawSlug}`;
        return `https://auronio.com${cleanSlug}`;
      }

      case 'linktree':
        return `https://auronio.com/p/${encodeURIComponent(linktreeData.title.toLowerCase().replace(/\s+/g, '-'))}`;

      case 'menu': {
        const rawSlug = menuData.slug || 'meni';
        const cleanSlug = rawSlug.startsWith('/') ? rawSlug : `/r/${rawSlug}`;
        return `https://auronio.com${cleanSlug}`;
      }

      case 'vcard':
        return `BEGIN:VCARD
VERSION:3.0
N:${vcardData.lastName};${vcardData.firstName};;;
FN:${vcardData.firstName} ${vcardData.lastName}
ORG:${vcardData.company}
TITLE:${vcardData.position}
TEL;TYPE=CELL:${vcardData.phone}
EMAIL:${vcardData.email}
URL:${vcardData.website}
ADR:;;${vcardData.location};;;;
NOTE:${vcardData.calendarNote}
END:VCARD`;

      case 'wifi': {
        const pass = wifiData.encryption === 'nopass' ? '' : wifiData.password;
        return `WIFI:S:${wifiData.ssid};T:${wifiData.encryption};P:${pass};;`;
      }

      case 'video': {
        return videoData.ctaUrl || (videoData as any).destinationUrl || videoData.videoUrl || (videoData as any).url || 'https://auronio.com';
      }

      default:
        return 'https://auronio.com';
    }
  }, [activeModule, urlData, linktreeData, menuData, vcardData, wifiData, videoData]);

  // Active module data selector
  const currentModuleData = useMemo(() => {
    switch (activeModule) {
      case 'url':
        return urlData;
      case 'linktree':
        return linktreeData;
      case 'menu':
        return menuData;
      case 'vcard':
        return vcardData;
      case 'wifi':
        return wifiData;
      case 'video':
        return videoData;
    }
  }, [activeModule, urlData, linktreeData, menuData, vcardData, wifiData, videoData]);

  // Load a record from saved drawer
  const handleSelectRecord = (record: QrRecord) => {
    setActiveModule(record.moduleType);
    if (record.style) {
      setQrStyle(record.style);
    }
    if (record.moduleType === 'url') setUrlData(record.data as UrlData);
    if (record.moduleType === 'linktree') setLinktreeData(record.data as LinktreeData);
    if (record.moduleType === 'menu') setMenuData(record.data as MenuData);
    if (record.moduleType === 'vcard') setVcardData(record.data as VCardData);
    if (record.moduleType === 'wifi') setWifiData(record.data as WifiData);
    if (record.moduleType === 'video') setVideoData(record.data as VideoData);
  };

  const handleScrollToGenerator = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans antialiased selection:bg-[#1D1D1F] selection:text-white pb-12">
      {/* Header Bar */}
      <Header
        userTier={userTier}
        authUser={authUser}
        onOpenSavedRecords={() => setIsSavedDrawerOpen(true)}
        onOpenPricing={() => {
          const pricingEl = document.getElementById('pricing-grid');
          pricingEl?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={() => setAuthUser(null)}
      />

      {/* Hero Workspace Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Intro Tagline & Subtitle */}
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Platforma za napredne digitalne integracije.
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal">
            Ustvarite, upravljajte in analizirajte pametne QR kode na enem mestu v okviru Auronio Beta programa.
          </p>
        </div>

        {/* DECOUPLED MODULAR NAVIGATION TABS */}
        <div className="p-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-x-auto scrollbar-none">
          <nav className="flex space-x-1 min-w-max">
            {/* Tab 1: Spletna stran */}
            <button
              type="button"
              onClick={() => setActiveModule('url')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeModule === 'url'
                  ? 'bg-[#0066CC] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Globe className="w-4 h-4" />
              Spletna stran
            </button>

            {/* Tab 2: Seznam povezav */}
            <button
              type="button"
              onClick={() => setActiveModule('linktree')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeModule === 'linktree'
                  ? 'bg-[#0066CC] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <LayoutList className="w-4 h-4" />
              Seznam povezav
            </button>

            {/* Tab 3: Meni & PDF katalog */}
            <button
              type="button"
              onClick={() => setActiveModule('menu')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeModule === 'menu'
                  ? 'bg-[#0066CC] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Utensils className="w-4 h-4" />
              Meni & PDF katalog
            </button>

            {/* Tab 4: Pametna vCard+ vizitka */}
            <button
              type="button"
              onClick={() => setActiveModule('vcard')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeModule === 'vcard'
                  ? 'bg-[#0066CC] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Contact className="w-4 h-4" />
              Pametna vCard+ vizitka
            </button>

            {/* Tab 5: Brezžično omrežje */}
            <button
              type="button"
              onClick={() => setActiveModule('wifi')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeModule === 'wifi'
                  ? 'bg-[#0066CC] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Wifi className="w-4 h-4" />
              Brezžično omrežje
            </button>

            {/* Tab 6: Video vsebine */}
            <button
              type="button"
              onClick={() => setActiveModule('video')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeModule === 'video'
                  ? 'bg-[#0066CC] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Video className="w-4 h-4" />
              Video vsebine
            </button>
          </nav>
        </div>

        {/* 2-COLUMN MAIN WORKSPACE LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDE: ACTIVE MODULE FORM ENTRY */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
            {activeModule === 'url' && (
              <UrlModule data={urlData} onChange={setUrlData} />
            )}

            {activeModule === 'linktree' && (
              <LinktreeModule data={linktreeData} onChange={setLinktreeData} />
            )}

            {activeModule === 'menu' && (
              <MenuModule data={menuData} onChange={setMenuData} />
            )}

            {activeModule === 'vcard' && (
              <VCardModule data={vcardData} onChange={setVcardData} />
            )}

            {activeModule === 'wifi' && (
              <WifiModule data={wifiData} onChange={setWifiData} />
            )}

            {activeModule === 'video' && (
              <VideoModule data={videoData} onChange={setVideoData} />
            )}
          </div>

          {/* RIGHT SIDE: STICKY PREVIEW TERMINAL CARD & COMMAND CENTER */}
          <div className="lg:col-span-5">
            <PreviewTerminal
              activeModule={activeModule}
              payloadString={payloadString}
              moduleData={currentModuleData}
              userTier={userTier}
              customFolders={customFolders}
              qrStyle={qrStyle}
              onStyleChange={setQrStyle}
              onOpenMobilePreview={() => setIsMobilePreviewOpen(true)}
              onOpenAnalytics={() => setIsAnalyticsOpen(true)}
              onOpenPricing={() => {
                const pricingEl = document.getElementById('pricing-grid');
                pricingEl?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>
        </div>

        {/* TRANSPARENT BETA PROGRAM PRICING GRID SECTION */}
        <div id="pricing-grid">
          <PricingGrid
            onScrollToGenerator={handleScrollToGenerator}
          />
        </div>
      </main>

      {/* MODALS AND DRAWERS */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setAuthUser(user);
        }}
      />

      <EnterpriseModal
        isOpen={isEnterpriseModalOpen}
        onClose={() => setIsEnterpriseModalOpen(false)}
      />

      <MobilePreviewModal
        isOpen={isMobilePreviewOpen}
        onClose={() => setIsMobilePreviewOpen(false)}
        activeModule={activeModule}
        moduleData={currentModuleData}
        videoUrl={activeModule === 'video' ? videoData.videoUrl : undefined}
        ctaText={activeModule === 'video' ? videoData.ctaText : undefined}
        destinationUrl={activeModule === 'video' ? videoData.ctaUrl : undefined}
      />

      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        userTier={userTier}
      />

      <SavedRecordsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        onSelectRecord={handleSelectRecord}
        userTier={userTier}
        onSelectTier={setUserTier}
        onOpenEnterpriseModal={() => setIsEnterpriseModalOpen(true)}
        customFolders={customFolders}
        setCustomFolders={setCustomFolders}
      />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
