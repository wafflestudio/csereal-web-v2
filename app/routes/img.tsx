import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

/**
 * SSRF (Server-Side Request Forgery) 공격 방지를 위한 허용 도메인 화이트리스트
 *
 * 이미지 프록시가 임의의 URL로 요청을 보낼 수 있으면, 공격자가 내부 네트워크나
 * 민감한 서비스에 접근할 수 있습니다. 예를 들어:
 * - 내부 IP 주소 (127.0.0.1, 192.168.x.x 등)
 * - 클라우드 메타데이터 서비스 (169.254.169.254 등)
 * - 내부 관리 API
 *
 * 이 화이트리스트를 통해 신뢰할 수 있는 도메인에서만 이미지를 가져올 수 있도록 제한합니다.
 */
const ALLOWED_DOMAINS = [
  'cse.snu.ac.kr',
  '168.107.16.249.nip.io',
  ...(import.meta.env.DEV ? ['localhost'] : []),
];

const CACHE_DIR = import.meta.env.DEV
  ? path.join(process.cwd(), '.cache', 'images')
  : '/img-optimized';

/**
 * 개발 모드에서 이미지가 prod 환경에 있을 경우를 대비해 호스트를 prod로 변경
 * dev 모드에서만 동작하며, 일부 이미지가 prod에만 올라가 있는 경우를 처리
 */
function replaceHostWithProd(url: string): string {
  try {
    const parsedUrl = new URL(url);
    parsedUrl.hostname = 'cse.snu.ac.kr';
    parsedUrl.protocol = 'https:';
    return parsedUrl.toString();
  } catch {
    return url;
  }
}

function throwIfInvalidRequest(
  imageUrl: string | null,
  quality: number,
): imageUrl is string {
  if (!imageUrl) {
    // TODO: prerender에서 에러를 방지하기 위한 hack
    throw new Response('Missing URL parameter', { status: 200 });
  }
  if (quality < 1 || quality > 100) {
    // TODO: prerender에서 에러를 방지하기 위한 hack
    throw new Response('Quality must be between 1 and 100', { status: 200 });
  }
  return true;
}

function validateDomain(imageUrl: string): URL {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    throw new Response('Invalid URL', { status: 400 });
  }

  const isAllowed = ALLOWED_DOMAINS.some((domain) =>
    parsedUrl.hostname.includes(domain),
  );

  if (!isAllowed) {
    throw new Response('Domain not allowed', { status: 403 });
  }

  return parsedUrl;
}

function getCachePath(
  imageUrl: string,
  quality: number,
  width?: number,
): string {
  const hash = crypto.createHash('sha256').update(imageUrl).digest('hex');
  const cacheKey = width
    ? `${hash}-w${width}-q${quality}.avif`
    : `${hash}-q${quality}.avif`;
  return path.join(CACHE_DIR, cacheKey);
}

async function getCachedImage(cachePath: string): Promise<Response | null> {
  try {
    const cached = await fs.readFile(cachePath);
    return new Response(new Uint8Array(cached), {
      headers: {
        'Content-Type': 'image/avif',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Image-Optimized': 'true',
        'X-Cache': 'HIT',
      },
    });
  } catch {
    return null;
  }
}

/**
 * 이미지를 fetch (dev 모드에서 404 시 prod로 fallback)
 */
async function fetchImageWithProdFallback(imageUrl: string): Promise<Response> {
  let imageResponse: Response;
  let actualImageUrl = imageUrl;

  try {
    imageResponse = await fetch(imageUrl);

    // dev 모드에서 404 발생 시 prod 환경으로 fallback
    if (
      (import.meta.env.DEV || import.meta.env.MODE === 'beta') &&
      imageResponse.status === 404
    ) {
      actualImageUrl = replaceHostWithProd(imageUrl);
      imageResponse = await fetch(actualImageUrl);
    }
  } catch {
    throw new Response(`Failed to fetch image: ${imageUrl}`, { status: 502 });
  }

  if (!imageResponse.ok) {
    throw new Response(`Failed to fetch image: ${actualImageUrl}`, {
      status: 502,
    });
  }

  return imageResponse;
}

async function convertToAvif(
  buffer: Buffer,
  quality: number,
  width?: number,
): Promise<Buffer> {
  let pipeline = sharp(buffer);

  if (width) {
    pipeline = pipeline.resize(width, null, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  return await pipeline
    .avif({ quality, chromaSubsampling: '4:2:0' })
    .toBuffer();
}

function saveToCache(cachePath: string, buffer: Buffer): void {
  fs.mkdir(CACHE_DIR, { recursive: true })
    .then(() => fs.writeFile(cachePath, buffer))
    .catch((error) => console.error('Failed to cache image:', error));
}

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const imageUrlParam = url.searchParams.get('url');
  const quality = parseInt(url.searchParams.get('q') || '80', 10);
  const widthParam = url.searchParams.get('w');
  const width = widthParam ? parseInt(widthParam, 10) : undefined;

  if (!throwIfInvalidRequest(imageUrlParam, quality)) {
    return; // unreachable
  }

  if (width !== undefined && (width < 1 || width > 5000)) {
    throw new Response('Width must be between 1 and 5000', { status: 400 });
  }

  const imageUrl = imageUrlParam;
  validateDomain(imageUrl);

  // SVG/GIF는 최적화 스킵 (dev 모드에서 404 시 prod로 fallback)
  if (imageUrl.endsWith('.svg') || imageUrl.endsWith('.gif')) {
    return await fetchImageWithProdFallback(imageUrl);
  }

  const cachePath = getCachePath(imageUrl, quality, width);

  // 캐시 히트 체크
  const cached = await getCachedImage(cachePath);
  if (cached) return cached;

  // 원본 이미지 fetch
  const imageResponse = await fetchImageWithProdFallback(imageUrl);

  // 이미 AVIF면 스킵
  const contentType = imageResponse.headers.get('content-type');
  if (contentType === 'image/avif') return imageResponse;

  // Sharp로 AVIF 변환
  const arrayBuffer = await imageResponse.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const optimizedBuffer = await convertToAvif(buffer, quality, width);
    saveToCache(cachePath, optimizedBuffer);

    return new Response(new Uint8Array(optimizedBuffer), {
      headers: {
        'Content-Type': 'image/avif',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Image-Optimized': 'true',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Image optimization failed:', error);
    // 최적화 실패 시 원본 반환
    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }
}
