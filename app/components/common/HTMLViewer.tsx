import './suneditor-contents.css';

import { Autolinker } from 'autolinker';
import useResponsive from '~/hooks/useResponsive';

interface TopRightImage {
  src: string;
  width: number;
  height: number;
  mobileFullWidth?: boolean;
}

interface HTMLViewerProps {
  html: string;
  image?: TopRightImage;
  variant?: 'default' | 'muted' | 'compact';
}

export default function HTMLViewer({
  html,
  image,
  variant = 'default',
}: HTMLViewerProps) {
  const isMobile = useResponsive();

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
  const imageWidth =
    image && isMobile && image.mobileFullWidth ? undefined : image?.width;

  const contentTone =
    variant === 'muted'
      ? 'text-neutral-600'
      : variant === 'compact'
        ? 'text-sm leading-6'
        : '';

  return (
    <div className="flow-root">
      {image && (
        <div
          className="relative mb-7 w-full sm:float-right sm:ml-7 sm:w-auto"
          style={imageWidth ? { width: `${imageWidth}px` } : undefined}
        >
          <img
            src={image.src}
            alt="대표 이미지"
            width={image.width}
            height={image.height}
            className="w-full object-contain"
          />
        </div>
      )}
      <div
        className={`sun-editor-editable ${contentTone}`}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: TODO 근데 대안이 있나?
        dangerouslySetInnerHTML={{ __html: trimmedHTML }}
      />
    </div>
  );
}
