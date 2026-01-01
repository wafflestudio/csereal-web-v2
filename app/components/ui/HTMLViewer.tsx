import './assets/suneditor-contents.css';

import clsx from 'clsx';
import Image from '~/components/ui/Image';
import { useNonce } from '~/hooks/useNonce';
import useIsMobile from '~/hooks/useResponsive';
import { type Falsy, isNotFalsy } from '~/types/utils';
import type { ProcessedHtml } from '~/utils/csp';

interface TopRightImage {
  src: string;
  width: 200 | 240 | 320;
  height: number;
  mobileFullWidth?: boolean;
}

interface HTMLViewerProps {
  html: ProcessedHtml;
  image?: TopRightImage | Falsy;
  component?: React.ReactNode | Falsy;
}

export default function HTMLViewer({
  html,
  image,
  component,
}: HTMLViewerProps) {
  const isMobile = useIsMobile();
  const nonce = useNonce();

  const { html: trimmedHTML, cssRules, styleKey } = html;

  // image width 계산
  const hasImage = isNotFalsy(image);
  const imageWidth = hasImage
    ? isMobile && image.mobileFullWidth
      ? undefined
      : image?.width
    : undefined;

  const hasComponent = isNotFalsy(component);

  return (
    <div className="flow-root">
      {hasImage && (
        <div
          className={clsx(
            'relative mb-7 w-full sm:float-right sm:ml-7',
            imageWidth ? IMAGE_WIDTH_CLASS[imageWidth] : null,
          )}
        >
          <Image
            src={image.src}
            alt="대표 이미지"
            width={image.width}
            height={image.height}
            className="w-full object-contain"
          />
        </div>
      )}
      {hasComponent && <div className="relative float-right">{component}</div>}
      <div
        className="sun-editor-editable"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML 콘텐츠 렌더링 필요
        dangerouslySetInnerHTML={{ __html: trimmedHTML }}
      />
      {/* https://github.com/facebook/react/issues/32449 */}
      {cssRules.length > 0 && (
        <style href={styleKey} nonce={nonce} precedence="blahblah">
          {cssRules}
        </style>
      )}
    </div>
  );
}

const IMAGE_WIDTH_CLASS: Record<TopRightImage['width'], string> = {
  200: 'sm:w-[200px]',
  240: 'sm:w-[240px]',
  320: 'sm:w-[320px]',
};
