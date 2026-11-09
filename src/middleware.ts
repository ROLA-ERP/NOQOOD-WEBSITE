import { NextResponse, type NextRequest } from 'next/server';

// Every public page lives under /ar or /en. A visitor arriving without a language is sent to the one they used before (cookie) or the browser's
// preferred language, defaulting to Arabic. The administration area and the API are left alone.
const SKIP = /^\/(ar|en|admin|api|_next|favicon|noqood|robots\.txt|sitemap\.xml|images)/;

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (SKIP.test(pathname) || /\.[a-z0-9]{2,5}$/i.test(pathname)) return NextResponse.next();
  const saved = req.cookies.get('nq_lang')?.value;
  const accept = req.headers.get('accept-language') || '';
  const lang = saved === 'en' || saved === 'ar' ? saved : /^en/i.test(accept) ? 'en' : 'ar';
  const url = req.nextUrl.clone();
  url.pathname = `/${lang}${pathname === '/' ? '' : pathname}`;
  url.search = search;
  return NextResponse.redirect(url, 307);
}

export const config = { matcher: ['/((?!_next/static|_next/image).*)'] };
