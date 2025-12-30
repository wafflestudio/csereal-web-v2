import type { Route } from '.react-router/types/app/+types/root';
import {
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import './app.css';
import clsx from 'clsx';
import Footer from '~/components/layout/Footer';
import LNB from '~/components/layout/LeftNav';
import MobileNav from '~/components/layout/MobileNav';
import { useLanguage } from '~/hooks/useLanguage';

import 'dayjs/locale/ko';
import { Toaster } from 'sonner';
import useIsMobile from '~/hooks/useResponsive';
import { useStore } from '~/store';

// Loader for handling redirects
export async function loader({ request }: Route.LoaderArgs) {
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

  return null;
}

export default function App() {
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
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
