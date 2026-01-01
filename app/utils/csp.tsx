import crypto from 'node:crypto';
import Autolinker from 'autolinker';
import * as cheerio from 'cheerio';
import { createContext } from 'react-router';

export const nonceContext = createContext<string>();

export const createNonce = () => crypto.randomBytes(16).toString('hex');

export const getCSPHeaders = (nonce: string) =>
  [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' http://dapi.kakao.com`,
    `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
    "img-src 'self' https://cse.snu.ac.kr",
    "font-src 'self' https://fonts.gstatic.com",
  ]
    .join('; ')
    .trim();

export interface ProcessedHtml {
  html: string;
  cssRules: string[];
  styleKey: string;
}

export const processHtmlForCsp = (html: string): ProcessedHtml => {
  // 400.XXX같은 값들이 링크 처리되는걸 막기 위해 tldMatches false처리
  const linkedHTML = Autolinker.link(html, {
    urls: { tldMatches: false },
  }).trim();

  if (!linkedHTML) {
    return { html: '', cssRules: [], styleKey: generateHash('').toString() };
  }

  const $ = cheerio.load(linkedHTML);

  // <html> 태그가 있으면 body 내용만 추출
  if (linkedHTML.startsWith('<html>')) {
    const bodyContent = $('body').html();
    if (bodyContent) {
      // body 내용으로 교체
      $.root().empty().append(bodyContent);
    }
  }

  // style attribute를 ID 기반 CSS로 변환
  let elementCounter = 0;
  const cssRules: string[] = [];
  const styleToIdMap = new Map<string, string>(); // 동일 스타일 재사용을 위한 맵

  $('[style]').each((_i, el) => {
    const $el = $(el);
    const styleAttr = $el.attr('style');
    if (styleAttr === undefined) return;

    const finalStyle =
      el.tagName === 'img' ? `${styleAttr} height:auto;` : styleAttr;

    let elementId = styleToIdMap.get(finalStyle);
    if (!elementId) {
      elementId = `html-viewer-el-${elementCounter++}`;
      styleToIdMap.set(finalStyle, elementId);
      cssRules.push(`#${elementId} { ${finalStyle} }`);
    }

    $el.attr('id', elementId);
    $el.removeAttr('style');
  });

  const trimmedHTML = $.html();
  const styleKey = generateHash([...styleToIdMap.keys()].join(',')).toString();

  return { html: trimmedHTML, cssRules, styleKey };
};

const generateHash = (string: string) => {
  let hash = 0;
  for (const char of string) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0; // Constrain to 32bit integer
  }
  return hash;
};
