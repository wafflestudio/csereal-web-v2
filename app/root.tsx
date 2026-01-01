import type { Route } from '.react-router/types/app/+types/root';
import {
  data,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import './app.css';
import '~/components/ui/sonner/styles.css';
import clsx from 'clsx';
import Footer from '~/components/layout/Footer';
import LNB from '~/components/layout/LeftNav';
import MobileNav from '~/components/layout/MobileNav';
import { Toaster } from '~/components/ui/sonner';
import { useLanguage } from '~/hooks/useLanguage';
import { useNonce } from '~/hooks/useNonce';
import useIsMobile from '~/hooks/useResponsive';
import { useStore } from '~/store';
import { createNonce, getCSPHeaders, nonceContext } from '~/utils/csp';

// Loader for handling redirects
export async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // /ko/* → /* redirect
  if (pathname.startsWith('/ko')) {
    return redirect(pathname.replace('/ko', '') || '/');
  }

  // / 진입 시 언어 감지
  if (pathname === '/') {
    // Detect browser language
    const acceptLanguage = request.headers.get('accept-language');
    const browserLang = acceptLanguage?.split(',')[0]?.toLowerCase();

    // If browser language is English, redirect to /en
    if (browserLang?.startsWith('en')) {
      return redirect('/en');
    }
  }

  const nonce = createNonce();

  const cookies = request.headers.get('cookie');
  const hasSession = cookies?.includes('JSESSIONID=');

  const headers = {
    ...(hasSession
      ? {}
      : {
          [import.meta.env.PROD
            ? 'Content-Security-Policy'
            : 'Content-Security-Policy-Report-Only']: getCSPHeaders(nonce),
        }),
    /** @see https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security */
    'Strict-Transport-Security': 'max-age=3600', // 1 hour. HTTPS only
    'X-Frame-Options': 'SAMEORIGIN', // Prevent clickjacking
    'X-Content-Type-Options': 'nosniff', // Prevent MIME type sniffing
  };

  context.set(nonceContext, nonce);

  return data({ nonce }, { headers });
}

export function headers({ loaderHeaders }: Route.HeadersArgs) {
  return loaderHeaders;
}

export default function App() {
  const nonce = useNonce();
  const { locale, pathWithoutLocale } = useLanguage();
  const isMain = pathWithoutLocale === '/';
  const paddingLeft = isMain ? `sm:pl-[11rem]` : 'sm:pl-[6.25rem]';

  const isMobile = useIsMobile();
  const isOpen = useStore((s) => s.navbarState.type !== 'closed');
  const isScrollBlocked = isMobile && isOpen;

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {import.meta.env.DEV && <meta property="csp-nonce" nonce={nonce} />}
        <link rel="icon" href="/favicon.ico" />
        <Meta />
        <Links />
      </head>
      <body className="sm:min-w-[1200px] bg-neutral-900 font-normal text-neutral-950">
        <LNB />
        <MobileNav />
        <main
          className={clsx(
            'flex min-h-full min-w-full flex-col',
            paddingLeft,
            isScrollBlocked ? 'overflow-hidden h-full' : '',
          )}
        >
          <Outlet />
          <Footer />
          <Toaster />
        </main>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}
