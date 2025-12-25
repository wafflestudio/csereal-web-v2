import type { ImgHTMLAttributes } from 'react';
import { buildOptimizedUrl, shouldOptimize } from '~/utils/image';

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & { quality?: number };

export default function Image({
  src: _src,
  onError,
  quality,
  width,
  ...props
}: ImageProps) {
  const widthNum = typeof width === 'string' ? parseInt(width, 10) : width;

  if (!shouldOptimize(_src)) {
    return <img {...props} src={_src} alt={props.alt} width={width} />;
  }

  // width가 있으면 srcset 생성 (1x, 2x, 3x)
  if (widthNum) {
    const src1x = buildOptimizedUrl(_src, quality, widthNum);
    const src2x = buildOptimizedUrl(_src, quality, widthNum * 2);
    const src3x = buildOptimizedUrl(_src, quality, widthNum * 3);
    const srcset = `${src1x} 1x, ${src2x} 2x, ${src3x} 3x`;

    return (
      <img
        {...props}
        src={src1x}
        srcSet={srcset}
        alt={props.alt}
        width={width}
      />
    );
  }

  // width가 없으면 기존 방식
  const src = buildOptimizedUrl(_src, quality);
  return <img {...props} src={src} alt={props.alt} width={width} />;
}
