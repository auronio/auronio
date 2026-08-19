import { createClient } from '@supabase/supabase-js';
import { QrRecord } from '../types';

const SUPABASE_URL = 'https://qfqekeeoppgsvyixqhkt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_SbwA2eaodd_xfYkzPZgTVw_DpWJMKoh';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Admin allowlist — ti e-mail naslovi dobijo poln (enterprise) dostop brez omejitev,
// takoj ko se registrirajo/prijavijo z real Supabase Auth kontom.
// Dodaj svoj e-mail sem, da lahko testiraš portal brez omejitev.
export const ADMIN_EMAILS: string[] = [
  'igorkuzelj@tech-center.com',
  'igorkuzelj8@gmail.com',
  'igor.kuzelj@gs-sevnica.si',
];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());
}

const LOCAL_STORAGE_KEY = 'auronio_qr_records_v1';

const DEFAULT_SAMPLE_RECORDS: QrRecord[] = [
  {
    id: 'demo-1',
    title: 'Poletna promocijska koda',
    folder: 'Trženjske kampanje 📈',
    moduleType: 'url',
    payload: 'https://auronio.com/r/poletna-ponudba',
    data: { url: 'https://auronio.com/poletje', pathType: 'dynamic', customSlug: 'poletna-ponudba' },
    style: { fgColor: '#0066CC', bgColor: '#FFFFFF', dotsStyle: 'Prestižne', logoUrl: null, size: 220 },
    userTier: 'premium',
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    scanCount: 412,
  },
  {
    id: 'demo-2',
    title: 'Ekskluzivna predstavitvena video vsebina',
    folder: 'Trženjske kampanje 📈',
    moduleType: 'video',
    payload: 'https://auronio.com',
    data: {
      videoUrl: 'https://youtu.be/P59wQ4SXtsg',
      title: 'Ekskluzivna predstavitev Auronio',
      description: 'Napredne pametne QR kode',
      ctaText: 'Obišči trgovino',
      ctaUrl: 'https://auronio.com',
    },
    style: { fgColor: '#0066CC', bgColor: '#FFFFFF', dotsStyle: 'Zaobljene', logoUrl: null, size: 220 },
    userTier: 'premium',
    createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    scanCount: 389,
  },
  {
    id: 'demo-3',
    title: 'Bistro Auronio Meni & Vinska karta',
    folder: 'Restavracije & Meniji 🍽️',
    moduleType: 'menu',
    payload: 'https://auronio.com/menu/bistro-auronio',
    data: {
      restaurantName: 'Gostilna & BISTRO Auronio',
      subtitle: 'Vrhunska mediteranska kuhinja & slovenska vina',
      pdfUrl: 'https://auronio.com/katalog.pdf',
      categories: ['Glavne jedi', 'Sladice'],
      items: [],
    },
    style: { fgColor: '#1D1D1F', bgColor: '#FFFFFF', dotsStyle: 'Pikčaste', logoUrl: null, size: 220 },
    userTier: 'uporabnik',
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    scanCount: 520,
  },
  {
    id: 'demo-4',
    title: 'Marko Novak - Direktorska vCard+',
    folder: 'Glavna mapa',
    moduleType: 'vcard',
    payload: 'BEGIN:VCARD\nVERSION:3.0\nFN:Marko Novak\nORG:Auronio d.o.o.\nEND:VCARD',
    data: {
      firstName: 'Marko',
      lastName: 'Novak',
      company: 'Auronio d.o.o.',
      position: 'Direktor razvoja',
      phone: '+386 41 123 456',
      email: 'marko.novak@auronio.com',
      website: 'https://auronio.com',
      location: 'Ljubljana',
      enableCalendar: true,
      calendarNote: '',
      avatarUrl: '',
    },
    style: { fgColor: '#0066CC', bgColor: '#FFFFFF', dotsStyle: 'Prestižne', logoUrl: null, size: 220 },
    userTier: 'enterprise',
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    scanCount: 145,
  },
  {
    id: 'demo-5',
    title: 'Gostinsko Wi-Fi Omrežje (VIP Konferenca)',
    folder: 'Dogodki 🎟️',
    moduleType: 'wifi',
    payload: 'WIFI:S:Auronio_Gosti_WiFi;T:WPA;P:GostVarnost!;;',
    data: { ssid: 'Auronio_Gosti_WiFi', password: 'GostVarnost!', encryption: 'WPA', hidden: false },
    style: { fgColor: '#1D1D1F', bgColor: '#FFFFFF', dotsStyle: 'Zaobljene', logoUrl: null, size: 220 },
    userTier: 'gost',
    createdAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    scanCount: 230,
  },
];

// Get initial local storage records
export function getLocalRecords(): QrRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading local records:', err);
  }
  // Initialize with sample records if empty
  saveLocalRecords(DEFAULT_SAMPLE_RECORDS);
  return DEFAULT_SAMPLE_RECORDS;
}

// Save local storage records
export function saveLocalRecords(records: QrRecord[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Error saving local records:', err);
  }
}

// Vrne ID trenutno prijavljenega uporabnika (ali null, če ni prijavljen)
export async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}

// Sync record to Supabase with local fallback (zapisano samo za prijavljenega uporabnika)
export async function syncRecordToSupabase(record: QrRecord): Promise<{ success: boolean; isOnline: boolean; message: string }> {
  // Update local storage first for immediate availability
  const current = getLocalRecords();
  const existingIdx = current.findIndex((r) => r.id === record.id);
  if (existingIdx >= 0) {
    current[existingIdx] = record;
  } else {
    current.unshift(record);
  }
  saveLocalRecords(current);

  const userId = await getCurrentUserId();
  if (!userId) {
    // Ni prijave -> ni pravega lastnika, shranimo samo lokalno (npr. gost preview)
    return {
      success: true,
      isOnline: false,
      message: 'Podatki shranjeni lokalno. Za trajno shranjevanje se prijavite.',
    };
  }

  try {
    const { error } = await supabase.from('qr_codes').upsert({
      id: record.id,
      user_id: userId,
      title: record.title,
      folder: record.folder,
      module_type: record.moduleType,
      payload: record.payload,
      data: record.data,
      style: record.style,
      user_tier: record.userTier,
      created_at: record.createdAt,
      scan_count: record.scanCount,
    });

    if (error) {
      console.warn('Supabase sync notice:', error.message);
      return {
        success: true,
        isOnline: false,
        message: 'Podatki uspešno shranjeni.',
      };
    }

    return {
      success: true,
      isOnline: true,
      message: 'Podatki uspešno shranjeni.',
    };
  } catch (err: any) {
    console.warn('Supabase connection attempt handled:', err);
    return {
      success: true,
      isOnline: false,
      message: 'Podatki uspešno shranjeni.',
    };
  }
}

// Fetch records belonging to the current logged-in user only (RLS + explicit filter)
export async function fetchAllRecords(): Promise<QrRecord[]> {
  const local = getLocalRecords();
  const userId = await getCurrentUserId();
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const mapped: QrRecord[] = data.map((row: any) => ({
        id: row.id,
        title: row.title || 'Neimenovana koda',
        folder: row.folder || 'Glavna mapa',
        moduleType: row.module_type || 'url',
        payload: row.payload || '',
        data: row.data || {},
        style: row.style || { fgColor: '#1D1D1F', bgColor: '#FFFFFF', dotsStyle: 'Zaobljene', logoUrl: null, size: 220 },
        userTier: row.user_tier || 'gost',
        createdAt: row.created_at || new Date().toISOString(),
        scanCount: row.scan_count || 0,
      }));
      saveLocalRecords(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('Using local records fallback:', err);
  }
  return local.length > 0 ? local : [];
}

// Delete record (samo če pripada trenutnemu uporabniku — dodatno ga varuje tudi RLS na strežniku)
export async function deleteRecord(id: string): Promise<boolean> {
  const current = getLocalRecords().filter((r) => r.id !== id);
  saveLocalRecords(current);

  const userId = await getCurrentUserId();
  try {
    const query = supabase.from('qr_codes').delete().eq('id', id);
    if (userId) {
      await query.eq('user_id', userId);
    } else {
      await query;
    }
  } catch (err) {
    console.warn('Error deleting from Supabase:', err);
  }
  return true;
}
