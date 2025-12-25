import { useState } from 'react';
import Image from '~/components/common/Image';
import SnuLogo from '~/components/layout/LeftNav/assets/SNU_Logo.svg?react';

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function ImageWithFallback({
  src,
  alt,
  className,
  width,
  height,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const style =
    width && height
      ? { width: `${width}px`, height: `${height}px` }
      : undefined;

  if (error || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-neutral-100 ${className ?? ''}`}
        style={style}
      >
        <SnuLogo className="h-10 w-10 text-neutral-200" />
      </div>
    );
  }

  return (
    <Image
      src={encodeURI(src)}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={() => setError(true)}
    />
  );
}
