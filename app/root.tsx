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
import { logPageView } from '~/utils/analytics/log-writer.server';
import { createNonce, getCSPHeaders, nonceContext } from '~/utils/csp';
import { detectLang } from '~/utils/lang';

export async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname === '/login/success') return redirect('/');

  // locale prefix 제거 (/ko, /en)
  const pathWithoutLocale = pathname.replace(/^\/(ko|en)/, '') || '/';

  // 유저 언어 감지 (1순위 쿠키, 2순위 Accept-Language)
  const lang = detectLang(request);

  if (lang === 'en' && !/^\/en/.test(pathname)) {
    return redirect(`/en${pathWithoutLocale}`);
  }

  if (lang === 'ko' && /^\/(en|ko)/.test(pathname)) {
    return redirect(pathWithoutLocale);
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
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Frame-Options': 'DENY', // Prevent clickjacking
    'X-Content-Type-Options': 'nosniff', // Prevent MIME type sniffing
    'Referrer-Policy': 'strict-origin-when-cross-origin', // Prevent referrer leakage
  };

  context.set(nonceContext, nonce);

  // Analytics 로깅 (실패해도 페이지는 정상 동작)
  logPageView(request).catch((error) =>
    console.error('Analytics logging failed:', error),
  );

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
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
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
