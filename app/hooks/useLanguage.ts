import { useLocation, useNavigate } from 'react-router';
import commonTranslations from '~/translations.json';
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

type CommonTranslations = typeof commonTranslations;
type CommonTranslationsKey = keyof CommonTranslations;

// Overload signatures
export function useLanguage(): UseLanguageWithTranslations<CommonTranslations>;
export function useLanguage<T extends Record<string, string>>(
  translations: T,
): UseLanguageWithTranslations<CommonTranslations & T>;
export function useLanguage<T extends Record<string, string>>(
  translations?: T,
):
  | UseLanguageWithTranslations<CommonTranslations>
  | UseLanguageWithTranslations<CommonTranslations & T> {
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

  // Merge commonTranslations with provided translations
  const mergedTranslations = {
    ...commonTranslations,
    ...(translations || {}),
  };

  const translateFn = (koreanKey: CommonTranslationsKey & keyof T): string => {
    if (locale === 'ko') return koreanKey;
    return mergedTranslations[koreanKey] || koreanKey;
  };

  return {
    locale,
    isEnglish,
    pathWithoutLocale,
    changeLanguage,
    localizedPath,
    t: translateFn,
    tUnsafe: translateFn as (koreanKey: string) => string,
  };
}
