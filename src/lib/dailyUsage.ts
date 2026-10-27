import { supabase, fetchAllRecords } from './supabase';

// Dnevni števci (ponastavitev ob polnoči po času Europe/Ljubljana — enako kot v SQL triggerju).
const TZ = 'Europe/Ljubljana';

export function todayKey(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: TZ }).format(date); // YYYY-MM-DD
}

async function currentUserId(): Promise<string> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user.id ?? 'anon';
  } catch {
    return 'anon';
  }
}

// ---- Mape: shranjene so samo v brskalniku, zato je števec "mehak" (varuje običajno uporabo,
// ne more pa ustaviti nekoga, ki ročno briše podatke brskalnika).
export async function foldersCreatedToday(): Promise<number> {
  try {
    const raw = localStorage.getItem(`auronio_folder_daily_v1:${await currentUserId()}`);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && parsed.day === todayKey() ? Number(parsed.count) || 0 : 0;
  } catch {
    return 0;
  }
}

export async function registerFolderCreated(): Promise<void> {
  try {
    const count = (await foldersCreatedToday()) + 1;
    localStorage.setItem(
      `auronio_folder_daily_v1:${await currentUserId()}`,
      JSON.stringify({ day: todayKey(), count })
    );
  } catch {
    /* ni kritično */
  }
}

// ---- Dinamične kode: resnica je v strežniku (get_my_daily_usage iz migracije 003, šteje tudi
// kode, ki jih je uporabnik že izbrisal). Rezerva: štetje današnjih kod med shranjenimi.
export async function fetchDailyDynamicCount(): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('get_my_daily_usage');
    if (!error && data && typeof (data as any).dynamic_codes === 'number') {
      return (data as any).dynamic_codes as number;
    }
  } catch {
    /* pade na rezervo */
  }
  const today = todayKey();
  const records = await fetchAllRecords();
  return records.filter((r) => !!r.slug && todayKey(new Date(r.createdAt)) === today).length;
}
