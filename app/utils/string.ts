export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    'Bytes',
    'KiB',
    'MiB',
    'GiB',
    'TiB',
    'PiB',
    'EiB',
    'ZiB',
    'YiB',
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))}${sizes[i]}`;
};

/**
 * URL pathname에서 locale을 추출합니다.
 * @param pathname - URL의 pathname (예: '/en/about/greetings' 또는 '/about/greetings')
 * @returns 'en' 또는 'ko'
 */
export const getLocaleFromPathname = (pathname: string): 'en' | 'ko' => {
  return pathname.startsWith('/en') ? 'en' : 'ko';
};

/**
 * Accept-Language 헤더에서 기본 언어(primary language)를 추출합니다.
 *
 * Accept-Language 헤더 포맷:
 * - 예시: "en-US,en;q=0.9,ko-KR;q=0.8,ko;q=0.7"
 * - 구조: "언어태그,언어태그;q=품질값,..."
 * - 언어태그: language[-region] (예: "en", "en-US", "ko-KR")
 * - 품질값(q): 0.0~1.0, 생략 시 1.0 (높을수록 선호)
 * - 우선순위: 품질값 > 나열 순서
 *
 * @param acceptLanguage - HTTP Accept-Language 헤더 값
 * @returns 기본 언어 코드 (예: 'en', 'ko', 'fr') 또는 빈 문자열
 *
 * @example
 * getPrimaryLanguage("en-US,en;q=0.9,ko;q=0.8") // "en"
 * getPrimaryLanguage("ko-KR,ko;q=0.9") // "ko"
 * getPrimaryLanguage("fr-FR;q=0.8,en;q=0.9") // "en" (품질값 우선)
 */
export const getPrimaryLanguage = (acceptLanguage: string): string => {
  if (!acceptLanguage) return '';

  // Accept-Language 헤더 파싱
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [tag, qPart] = lang.trim().split(';');
      const quality = qPart ? parseFloat(qPart.split('=')[1]) : 1.0;
      const primaryLang = tag.trim().toLowerCase().split('-')[0];
      return { primaryLang, quality };
    })
    .sort((a, b) => b.quality - a.quality); // 품질값 내림차순 정렬

  return languages[0]?.primaryLang || '';
};

// TODO: 필요한가??
export const encodeParam = (words: string) => words.replace(/\s+/g, '-');
export const decodeParam = (words: string) => words.replace(/-/g, ' ');
