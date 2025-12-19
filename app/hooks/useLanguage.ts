import { useLocation, useNavigate } from 'react-router';
import type { Locale } from '~/types/i18n';

interface UseLanguageBase {
  locale: Locale;
  isEnglish: boolean;
  pathWithoutLocale: string;
  changeLanguage: () => void;
  localizedPath: (path: string) => string;
}

interface UseLanguageWithTranslations<T extends Record<string, string>>
  extends UseLanguageBase {
  t: (koreanKey: keyof T & string) => string; // type-safe
  tUnsafe: (koreanKey: string) => string; // 동적 키 허용
}

// Overload signatures
export function useLanguage(): UseLanguageBase;
export function useLanguage<T extends Record<string, string>>(
  translations: T,
): UseLanguageWithTranslations<T>;
export function useLanguage<T extends Record<string, string>>(
  translations?: T,
): UseLanguageBase | UseLanguageWithTranslations<T> {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const locale = pathname.startsWith('/en') ? 'en' : 'ko';
  const isEnglish = locale === 'en';
  const pathWithoutLocale = pathname.replace(/^\/en/, '') || '/';

  const changeLanguage = () => {
    const newLocale = isEnglish ? 'ko' : 'en';
    if (newLocale === 'en') {
      navigate(`/en${pathWithoutLocale}${search}`);
    } else {
      navigate(`${pathWithoutLocale}${search}`);
    }
  };

  const localizedPath = (path: string): string => {
    return isEnglish ? `/en${path}` : path;
  };

  // If translations provided, create translation functions
  if (translations) {
    const translateFn = (koreanKey: string): string => {
      if (locale === 'ko') return koreanKey;
      return translations[koreanKey] || koreanKey;
    };

    return {
      locale,
      isEnglish,
      pathWithoutLocale,
      changeLanguage,
      localizedPath,
      t: translateFn as UseLanguageWithTranslations<T>['t'],
      tUnsafe: translateFn,
    };
  }

  return {
    locale,
    isEnglish,
    pathWithoutLocale,
    changeLanguage,
    localizedPath,
  };
}
