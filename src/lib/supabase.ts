// Auronio — Edge Function "redirect-qr"
//
// Namen: to je pravi strežniški "možgan" za auronio.com/r/{slug}.
// Ko nekdo skenira dinamično QR kodo:
//   1. poišče zapis po slug-u
//   2. DEJANSKO zabeleži sken (vrstica v qr_scan_events + +1 na qr_codes.scan_count)
//   3. preusmeri obiskovalca na pravi cilj (zunanji URL ali stran menija)
//
// Uporablja service_role ključ (nastavljen samodejno s strani Supabase kot
// SUPABASE_SERVICE_ROLE_KEY spremenljivka okolja), zato obide RLS pravila —
// to je edino mesto v celotnem sistemu, ki sme pisati sken dogodke.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const FALLBACK_URL = 'https://auronio.com';

function extractSlug(req: Request): string | null {
  const url = new URL(req.url);
  // Podpira oboje: /functions/v1/redirect-qr/moj-slug  IN  ?slug=moj-slug
  const pathParts = url.pathname.split('/').filter(Boolean);
  const fromPath = pathParts[pathParts.length - 1];
  const fromQuery = url.searchParams.get('slug');
  const candidate = fromQuery || (fromPath && fromPath !== 'redirect-qr' ? fromPath : null);
  return candidate ? decodeURIComponent(candidate) : null;
}

Deno.serve(async (req: Request) => {
  try {
    const slug = extractSlug(req);

    if (!slug) {
      return Response.redirect(FALLBACK_URL, 302);
    }

    // 1. Poišči QR zapis po slug-u
    const { data: record, error: findError } = await supabaseAdmin
      .from('qr_codes')
      .select('id, user_id, module_type, target_url, data, slug')
      .eq('slug', slug)
      .maybeSingle();

    if (findError || !record) {
      // Neveljaven/pobrisan slug — preusmeri na domačo stran namesto napake,
      // da obiskovalec ne vidi tehnične napake.
      return Response.redirect(FALLBACK_URL, 302);
    }

    // 2. Zabeleži pravi sken (asinhrono, ne blokira preusmeritve)
    const userAgent = req.headers.get('user-agent') || null;
    const referer = req.headers.get('referer') || null;

    // Vrstica v dnevnik dogodkov (za mesečno štetje in bodočo analitiko po lokaciji/napravi)
    void supabaseAdmin.from('qr_scan_events').insert({
      qr_code_id: record.id,
      user_id: record.user_id,
      user_agent: userAgent,
      referer: referer,
    });

    // Atomarno +1 na skupno število skenov (prikaz na kartici v Arhivu)
    void supabaseAdmin.rpc('increment_scan_count', { p_qr_code_id: record.id }).then(
      () => {},
      () => {
        // Če RPC funkcija še ni nameščena, poskusi enostaven fallback (manj varen pri sočasnosti, a deluje)
        supabaseAdmin
          .from('qr_codes')
          .select('scan_count')
          .eq('id', record.id)
          .maybeSingle()
          .then(({ data }) => {
            const next = (data?.scan_count || 0) + 1;
            void supabaseAdmin.from('qr_codes').update({ scan_count: next }).eq('id', record.id);
          });
      }
    );

    // 3. Ugotovi ciljni URL glede na tip modula
    let destination = FALLBACK_URL;

    if (record.module_type === 'url') {
      destination = record.target_url || (record.data as any)?.url || FALLBACK_URL;
    } else if (record.module_type === 'menu') {
      // Javna stran menija (frontend route, ki jo je treba še zgraditi — glej opombo v odgovoru)
      destination = `https://auronio.com/m/${encodeURIComponent(slug)}`;
    } else {
      destination = FALLBACK_URL;
    }

    // Varnostna zaščita: preusmerjamo samo na http(s) naslove, nikoli na javascript:/data: sheme
    if (!/^https?:\/\//i.test(destination)) {
      destination = FALLBACK_URL;
    }

    return Response.redirect(destination, 302);
  } catch (err) {
    console.error('redirect-qr error:', err);
    return Response.redirect(FALLBACK_URL, 302);
  }
});
