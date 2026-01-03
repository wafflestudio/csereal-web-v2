import crypto from 'node:crypto';
import Autolinker from 'autolinker';
import * as cheerio from 'cheerio';
import { createContext } from 'react-router';

export const nonceContext = createContext<string>();

export const createNonce = () => crypto.randomBytes(16).toString('hex');

export const getCSPHeaders = (nonce: string) =>
  [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://t1.daumcdn.net http://t1.daumcdn.net https://dapi.kakao.com`,
    // 해시는 radix dialog에서 사용하는 react-remove-scroll-bar의 스타일을 사용하기 위함
    `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com 'sha256-kAApudxpTi9mfjlC9lC8ZaS9xFHU9/NLLbB173MU7SU=' https://cdn.jsdelivr.net/gh/orioncactus/`,
    "img-src 'self' https://cse.snu.ac.kr https://mts.daumcdn.net http://mts.daumcdn.net https://t1.daumcdn.net http://t1.daumcdn.net",
    "font-src 'self' https://cdn.jsdelivr.net",
    "connect-src 'self' https://cdn.jsdelivr.net",
  ]
    .join('; ')
    .trim();

export interface ProcessedHtml {
  html: string;
  cssRules: string;
  styleKey: string;
}

export const processHtmlForCsp = (html: string): ProcessedHtml => {
  // 400.5 같은 숫자가 링크로 인식되는걸 방지 (tldMatches: false)
  const linkedHTML = Autolinker.link(html, {
    urls: { tldMatches: false },
  }).trim();

  const $ = cheerio.load(linkedHTML);

  // 모든 링크에 보안 속성 추가
  $('a').each((_i, el) => {
    const $a = $(el);
    const existingRel = $a.attr('rel');
    const newRel = existingRel
      ? `${existingRel} noopener noreferrer`
      : 'noopener noreferrer';
    $a.attr('rel', newRel);
  });

  // CSS 속성 -> 클래스명 매핑 (캐싱용)
  const propertyToClassMap = new Map<string, string>();
  const cssRules: string[] = [];

  $('[style]').each((_i, el) => {
    const $el = $(el);
    const styleAttr = $el.attr('style');
    if (styleAttr === undefined) return;

    // CSS 속성들을 개별적으로 파싱
    const properties = styleAttr
      .split(';')
      .map((prop) => prop.trim())
      .filter((prop) => prop.length > 0)
      .map((prop) => `${prop};`);
    const classNames = properties.map((property) => {
      const cached = propertyToClassMap.get(property);
      if (cached) return cached;

      // 새로운 클래스명 생성 (crypto 해시 + 접두사)
      const hash = crypto
        .createHash('md5')
        .update(property)
        .digest('base64url')
        .slice(0, 8);
      const className = `uwu-${hash}`;
      propertyToClassMap.set(property, className);
      // !important를 붙여서 기존 스타일보다 높은 우선순위 보장
      // property는 이미 세미콜론으로 끝나므로, 세미콜론 전에 !important 삽입
      const propertyWithImportant = property.replace(/;$/, ' !important');
      cssRules.push(`.${className} { ${propertyWithImportant} }`);

      return className;
    });

    $el.attr('class', classNames.join(' '));
    $el.removeAttr('style');
  });

  // <html> 태그가 있으면 body 내용만, 아니면 전체 HTML
  const trimmedHTML = $('html').length > 0 ? $('body').html() || '' : $.html();

  // styleKey는 모든 고유 속성을 정렬해서 해싱
  const allProperties = Array.from(propertyToClassMap.keys()).sort().join('|');
  const styleKey = crypto
    .createHash('md5')
    .update(allProperties)
    .digest('base64url')
    .slice(0, 12);

  return { html: trimmedHTML, cssRules: cssRules.join('\n'), styleKey };
};
