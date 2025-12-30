import type { ImgHTMLAttributes, SyntheticEvent } from 'react';
import { useState } from 'react';
import SnuLogo from '~/components/layout/LeftNav/assets/SNU_Logo.svg?react';
import { buildOptimizedUrl, shouldOptimize } from '~/utils/image';

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src?: string | null;
  quality?: number;
  width?: number;
};

export default function Image({
  src: _src,
  onError,
  quality,
  width,
  height,
  className,
  ...props
}: ImageProps) {
  const [prevSrc, setPrevSrc] = useState(_src);
  const [hasError, setHasError] = useState(false);

  if (prevSrc !== _src) {
    setPrevSrc(_src);
    setHasError(false);
  }

  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    onError?.(event);
  };

  if (hasError || !_src) {
    return (
      <div
        className={`flex items-center justify-center bg-neutral-100 ${
          className ?? ''
        }`}
        {...props}
      >
        <SnuLogo className="h-[60px] w-[60px] fill-neutral-200" />
      </div>
    );
  }

  if (!shouldOptimize(_src)) {
    return (
      <img
        {...props}
        src={_src}
        alt={props.alt}
        width={width}
        height={height}
        className={className}
        onError={handleError}
      />
    );
  }

  // width가 있으면 srcset 생성 (1x, 2x, 3x)
  if (width) {
    const src1x = buildOptimizedUrl(_src, quality, width);
    const src2x = buildOptimizedUrl(_src, quality, width * 2);
    const src3x = buildOptimizedUrl(_src, quality, width * 3);
    const srcset = `${src1x} ${width}w, ${src2x} ${width * 2}w, ${src3x} ${
      width * 3
    }w`;

    return (
      <img
        {...props}
        src={src1x}
        srcSet={srcset}
        alt={props.alt}
        width={width}
        height={height}
        className={className}
        onError={handleError}
      />
    );
  }

  // width가 없으면 기존 방식
  const src = buildOptimizedUrl(_src, quality);
  return (
    <img
      {...props}
      src={src}
      alt={props.alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
    />
  );
}
