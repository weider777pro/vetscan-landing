/* ============================================================
   VetScan Edge Middleware — server-side language redirect

   Runs on every request before static files are served.
   Behavior:
   - Skip if path is already localized (/uk/, /ru/, etc.)
   - Skip if static asset (.png, .css, etc.) — handled by matcher
   - Skip if user has cookie `vs_lang_chosen` (manual choice or prior visit)
   - Skip Googlebot and other crawlers (Accept-Language: en-* by convention)
   - Otherwise: detect locale from Accept-Language + Vercel geo headers,
     307-redirect to the localized version, set cookie

   Falls through gracefully if anything goes wrong — origin serves EN.
   ============================================================ */

export const config = {
  // Match everything EXCEPT static assets and Vercel internals.
  // Anything containing a dot in the last path segment is treated as a file.
  matcher: ['/((?!_next/|_vercel/|.*\\..*).*)'],
};

const SUPPORTED = ['es-mx', 'es-ar', 'pt-BR', 'uk', 'ru'];
const COOKIE_NAME = 'vs_lang_chosen';

function detectLocale(acceptLang, country) {
  const lang = (acceptLang || '').toLowerCase();

  // Spanish — split by region using geo (more reliable than Accept-Language)
  if (lang.startsWith('es')) {
    const argLike = ['AR', 'CL', 'UY'];
    if (argLike.includes(country)) return 'es-ar';
    // Accept-Language hints (some browsers send es-AR explicitly)
    if (lang.includes('es-ar') || lang.includes('es-cl') || lang.includes('es-uy')) {
      return 'es-ar';
    }
    return 'es-mx';
  }

  if (lang.startsWith('pt')) return 'pt-BR';
  if (lang.startsWith('uk')) return 'uk';
  // Russian + Kazakh (Kazakhstan) → Russian (matches existing i18n.js logic)
  if (lang.startsWith('ru') || lang.startsWith('kk')) return 'ru';

  return 'en';
}

function isAlreadyLocalized(pathname) {
  for (const loc of SUPPORTED) {
    if (pathname === '/' + loc || pathname.startsWith('/' + loc + '/')) {
      return true;
    }
  }
  return false;
}

function hasChoiceCookie(cookieHeader) {
  return /(?:^|;\s*)vs_lang_chosen=1(?:;|$)/.test(cookieHeader || '');
}

export default function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Already on a localized path → pass through
  if (isAlreadyLocalized(path)) return;

  // User has previously chosen a language → don't override
  const cookie = request.headers.get('cookie') || '';
  if (hasChoiceCookie(cookie)) return;

  // Detect target locale from headers
  const acceptLang = request.headers.get('accept-language') || '';
  const country = request.headers.get('x-vercel-ip-country') || '';
  const target = detectLocale(acceptLang, country);

  // Already correct locale (EN root) → pass through
  if (target === 'en') return;

  // Build redirect URL preserving path and query
  const newPath = '/' + target + (path === '/' ? '/' : path);
  const location = newPath + url.search;

  // 307 (temporary): preference can change. Set cookie so we don't redirect again.
  // Vary: Accept-Language is critical so the CDN doesn't cache
  // a redirect response and serve it to a different user.
  return new Response(null, {
    status: 307,
    headers: {
      'Location': location,
      'Set-Cookie': `${COOKIE_NAME}=1; Path=/; Max-Age=2592000; SameSite=Lax`,
      'Vary': 'Accept-Language, Cookie',
      'Cache-Control': 'private, no-store',
    },
  });
}
