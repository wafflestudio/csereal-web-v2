/**
 * 이미지 URL이 최적화 대상인지 확인
 */
export function shouldOptimize(src: string | undefined): src is string {
  if (!src) return false;
  if (!src.startsWith('http://') && !src.startsWith('https://')) return false;
  if (src.endsWith('.svg') || src.endsWith('.gif')) return false;
  if (src.includes('/img?')) return false;

  return true;
}

/**
 * 최적화된 이미지 URL 생성
 * @param src 원본 이미지 URL
 * @param quality AVIF 품질 (1-100, 기본값 50)
 * @param width 이미지 너비 (선택사항)
 * @returns 최적화된 이미지 URL
 */
export function buildOptimizedUrl(
  src: string,
  quality = 50,
  width?: number,
): string {
  const encodedUrl = encodeURIComponent(src);
  const params = new URLSearchParams({ url: src, q: quality.toString() });
  if (width) params.set('w', width.toString());
  return `/img?${params.toString()}`;
}
