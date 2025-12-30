import './assets/suneditor-contents.css';

import { Autolinker } from 'autolinker';
import Image from '~/components/ui/Image';
import useIsMobile from '~/hooks/useResponsive';
import { type Falsy, isNotFalsy } from '~/types/utils';

interface TopRightImage {
  src: string;
  width: number;
  height: number;
  mobileFullWidth?: boolean;
}

interface HTMLViewerProps {
  html: string;
  image?: TopRightImage | Falsy;
  component?: React.ReactNode | Falsy;
}

export default function HTMLViewer({
  html,
  image,
  component,
}: HTMLViewerProps) {
  const isMobile = useIsMobile();

  // 400.XXX같은 값들이 링크 처리되는걸 막기 위해 tldMatches false처리
  const linkedHTML = Autolinker.link(html, {
    urls: { tldMatches: false },
  }).trim();

  // TODO: 이거 필요한지 확인
  const trimmedHTML = linkedHTML.startsWith('<html>')
    ? linkedHTML.slice(
        linkedHTML.indexOf('<body>') + '<body>'.length,
        linkedHTML.lastIndexOf('</body>') - '</body>'.length,
      )
    : linkedHTML;

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
          className="relative mb-7 w-full sm:float-right sm:ml-7 sm:w-auto"
          style={imageWidth ? { width: `${imageWidth}px` } : undefined}
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
        // biome-ignore lint/security/noDangerouslySetInnerHtml: TODO 근데 대안이 있나?
        dangerouslySetInnerHTML={{ __html: trimmedHTML }}
      />
    </div>
  );
}
