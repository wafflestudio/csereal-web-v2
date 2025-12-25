import type { ImgHTMLAttributes } from 'react';
import { useEffect, useState } from 'react';
import { DEV_FILE_BASE_URL } from '~/constants/api';

type ImageProps = ImgHTMLAttributes<HTMLImageElement>;

export default function Image({ src, onError, ...props }: ImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    const shouldProxy =
      import.meta.env.DEV && src && src.startsWith(DEV_FILE_BASE_URL);
    if (!shouldProxy) return;

    let isUnmounted = false;

    (async () => {
      const isValid = await isImageValid(src);
      if (isValid || isUnmounted) return;

      const proxySrc = src.replace(DEV_FILE_BASE_URL, '/dev-proxy-file');
      setImgSrc(proxySrc);
    })();

    return () => {
      isUnmounted = true;
    };
  }, [src]);

  return <img {...props} src={imgSrc} alt={props.alt} />;
}

// https://github.com/facebook/react/issues/15446#issuecomment-484699248
function isImageValid(src: string) {
  const promise = new Promise((resolve) => {
    const img = document.createElement('img');
    img.onerror = () => resolve(false);
    img.onload = () => resolve(true);
    img.src = src;
  });

  return promise;
}
