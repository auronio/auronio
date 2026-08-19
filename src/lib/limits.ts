import { UserTier } from '../types';

export interface TierLimits {
  maxCustomFolders: number;
  maxActiveCodes: number;
  maxMonthlyScans: number;
  scanDisplayCap: string;
  codesDisplayCap: string;
  folderDisplayCap: string;
  tierName: string;
}

// Enotna definicija omejitev po paketih — uporabljata jo tako SavedRecordsDrawer
// (prikaz porabe) kot PreviewTerminal (dejansko blokiranje ob doseženi meji).
export function getTierLimits(userTier: UserTier): TierLimits {
  switch (userTier) {
    case 'gost':
      return {
        maxCustomFolders: 0,
        maxActiveCodes: 1,
        maxMonthlyScans: 100,
        scanDisplayCap: '100',
        codesDisplayCap: '1 koda',
        folderDisplayCap: '0 map (Zaklenjeno)',
        tierName: 'Gost',
      };
    case 'uporabnik':
      return {
        maxCustomFolders: 1,
        maxActiveCodes: 3,
        maxMonthlyScans: 300,
        scanDisplayCap: '300',
        codesDisplayCap: '3 kode',
        folderDisplayCap: '1 mapa po meri',
        tierName: 'Uporabnik (brezplačno)',
      };
    case 'premium':
      return {
        maxCustomFolders: 20,
        maxActiveCodes: 100,
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
        maxMonthlyScans: Infinity,
        scanDisplayCap: 'Neomejeno',
        codesDisplayCap: 'Neomejeno',
        folderDisplayCap: 'Neomejeno',
        tierName: 'Enterprise',
      };
  }
}
