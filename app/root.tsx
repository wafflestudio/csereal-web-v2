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

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="sm:min-w-[1200px] bg-neutral-900 font-normal text-neutral-950">
        <LNB />
        <MobileNav />
        <main
          className={clsx('flex min-h-full min-w-full flex-col', paddingLeft)}
        >
          <Outlet />
          <Footer />
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
