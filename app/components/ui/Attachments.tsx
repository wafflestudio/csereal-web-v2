import Image from '~/components/ui/Image';
import type { Attachment } from '~/types/api/v2/attachment';
import { formatBytes } from '~/utils/string';
import ClipIcon from './assets/clip.svg?react';

interface AttachmentsProps {
  files: Attachment[];
}

export default function Attachments({ files }: AttachmentsProps) {
  if (files.length === 0) return null;

  const variantSpacing =
    'mb-9 mt-3 py-3 pl-4 pr-20 sm:mb-11 sm:mt-5 sm:pr-[10rem]';

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

      <ClipIcon className="absolute right-2 -top-6" />
    </div>
  );
}
