import { UserTier } from '../types';

export interface TierLimits {
  maxCustomFolders: number;   // največ map po meri naenkrat (skupaj)
  maxActiveCodes: number;     // največ shranjenih kod skupaj
  dailyDynamicCodes: number;  // koliko NOVIH dinamičnih kod na dan (ponastavi se ob polnoči)
  dailyFolders: number;       // koliko NOVIH map na dan (ponastavi se ob polnoči)
  maxMonthlyScans: number;
  scanDisplayCap: string;
  codesDisplayCap: string;
  folderDisplayCap: string;
  tierName: string;
}

// Enotna definicija omejitev po paketih — uporabljajo jo SavedRecordsDrawer (prikaz),
// PreviewTerminal (blokiranje ob shranjevanju). Strežniška meja je v Supabase triggerju
// enforce_qr_code_tier (supabase/migrations/003_tiers_admin.sql) in mora biti usklajena.
export function getTierLimits(userTier: UserTier): TierLimits {
  switch (userTier) {
    case 'gost':
      return {
        maxCustomFolders: 0,
        maxActiveCodes: 1,
        dailyDynamicCodes: Infinity,
        dailyFolders: 0,
        maxMonthlyScans: 100,
        scanDisplayCap: '100',
        codesDisplayCap: '1 koda',
        folderDisplayCap: '0 map (Zaklenjeno)',
        tierName: 'Gost',
      };
    case 'uporabnik':
      return {
        maxCustomFolders: Infinity,
        maxActiveCodes: Infinity,
        dailyDynamicCodes: 3,
        dailyFolders: 1,
        maxMonthlyScans: 300,
        scanDisplayCap: '300',
        codesDisplayCap: '3 dinamične kode na dan',
        folderDisplayCap: '1 nova mapa na dan',
        tierName: 'Uporabnik (brezplačno)',
      };
    case 'partner':
      return {
        maxCustomFolders: 8,
        maxActiveCodes: 30,
        dailyDynamicCodes: Infinity,
        dailyFolders: Infinity,
        maxMonthlyScans: 10000,
        scanDisplayCap: '10.000',
        codesDisplayCap: '30 kod',
        folderDisplayCap: '8 map po meri',
        tierName: 'Partner',
      };
    case 'premium':
      return {
        maxCustomFolders: 20,
        maxActiveCodes: 100,
        dailyDynamicCodes: Infinity,
        dailyFolders: Infinity,
        maxMonthlyScans: 50000,
        scanDisplayCap: '50.000',
        codesDisplayCap: '100 kod',
        folderDisplayCap: '20 map po meri',
        tierName: 'Premium',
      };
    case 'enterprise':
      return {
        maxCustomFolders: Infinity,
        maxActiveCodes: Infinity,
        dailyDynamicCodes: Infinity,
        dailyFolders: Infinity,
        maxMonthlyScans: Infinity,
        scanDisplayCap: 'Neomejeno',
        codesDisplayCap: 'Neomejeno',
        folderDisplayCap: 'Neomejeno',
        tierName: 'Enterprise (admin)',
      };
  }
}
