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

  const [linktreeData, setLinktreeData] =
