import Image from '~/components/common/Image';
import type { Attachment } from '~/types/api/v2/attachment';
import { formatBytes } from '~/utils/string';
import clipIcon from './assets/clip.svg';

interface AttachmentsProps {
  files: Attachment[];
  variant?: 'default' | 'compact' | 'spacious';
}

export default function Attachments({
  files,
  variant = 'default',
}: AttachmentsProps) {
  if (files.length === 0) return null;

  const variantSpacing =
    variant === 'compact'
      ? 'mb-4 mt-2 py-2 pl-3 pr-12'
      : variant === 'spacious'
        ? 'mb-12 mt-6 py-4 pl-5 pr-24 sm:mb-14 sm:mt-8 sm:pr-[12rem]'
        : 'mb-9 mt-3 py-3 pl-4 pr-20 sm:mb-11 sm:mt-5 sm:pr-[10rem]';

  return (
    <div
      className={`relative flex flex-col gap-2 self-start rounded-sm border border-neutral-200 bg-white sm:w-auto sm:max-w-fit ${variantSpacing}`}
    >
      {files.map((file, index) => {
        const byteStr = formatBytes(file.bytes);
        const key = `${file.url}-${index}`;

        return (
          <a
            key={key}
            className="flex text-sm font-normal hover:underline"
            href={encodeURI(file.url)}
            download={file.name}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {file.name}
            </span>
            <span className="ml-2">({byteStr})</span>
          </a>
        );
      })}

      <Image src={clipIcon} alt="" className="absolute right-2 -top-6" />
    </div>
  );
}
