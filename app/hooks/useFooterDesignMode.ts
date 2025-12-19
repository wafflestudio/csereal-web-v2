import { useLocation } from 'react-router';

// TODO: 페이지별 모드 적용하기
export default function useFooterDesignMode() {
  const location = useLocation();
  const { pathname } = location;

  const isDarkMode = darkModePages.some((path) => {
    // Remove locale prefix if exists
    const pathWithoutLocale = pathname.replace(/^\/(ko|en)/, '');
    return (
      pathWithoutLocale === path || pathWithoutLocale.startsWith(`${path}/`)
    );
  });

  return isDarkMode ? 'dark' : 'light';
}

// Pages that use dark footer
const darkModePages = [
  '/',
  '/about',
  '/community',
  '/people',
  '/research',
  '/admissions',
  '/academics',
  '/reservations',
];
