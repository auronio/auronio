export type ModuleType = 'url' | 'linktree' | 'menu' | 'vcard' | 'wifi' | 'video';

export type UserTier = 'gost' | 'uporabnik' | 'premium' | 'enterprise';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  initials: string;
}

export type FolderCategory = 
  | 'Vse 📂' 
  | 'Glavna mapa' 
  | 'Trženjske kampanje 📈' 
  | 'Dogodki 🎟️' 
  | 'Restavracije & Meniji 🍽️';

export interface UrlData {
  url: string;
  pathType: 'static' | 'dynamic';
  customSlug: string;
}

export interface LinktreeLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
}

export interface LinktreeData {
  title: string;
  bio: string;
  avatarUrl: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  customLinks: LinktreeLink[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: string;
  description: string;
  badge?: string;
  category: string;
}

export interface MenuData {
  restaurantName: string;
  subtitle: string;
  pdfUrl: string;
  pdfFileName?: string;
  pdfFileSize?: string;
  slug?: string;
  categories: string[];
  items: MenuItem[];
}

export interface VCardData {
  firstName: string;
  lastName: string;
  company: string;
  position: string;
  phone: string;
  email: string;
  website: string;
  location: string;
  enableCalendar: boolean;
  calendarNote: string;
  avatarUrl: string;
}

export interface WifiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VideoData {
  videoUrl: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  slug?: string;
}

export type DotStyle = 'Zaobljene' | 'Pikčaste' | 'Prestižne';

export interface QrStyleConfig {
  fgColor: string;
  bgColor: string;
  dotsStyle: DotStyle;
  logoUrl: string | null;
  size: number;
}

export interface QrRecord {
  id: string;
  title: string;
  folder: FolderCategory;
  moduleType: ModuleType;
  payload: string;
  data: UrlData | LinktreeData | MenuData | VCardData | WifiData | VideoData;
  style: QrStyleConfig;
  userTier: UserTier;
  createdAt: string;
  scanCount: number;
}
