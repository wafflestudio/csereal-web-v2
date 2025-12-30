import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { Link } from 'react-router';
import Image from '~/components/ui/Image';
import { useLanguage } from '~/hooks/useLanguage';

interface NewsRowProps {
  href: string;
  title: string;
  date: string;
  imageURL: string | null;
  partialDescription: string;
  boldStartIndex: number;
  boldEndIndex: number;
}

export default function NewsRow({
  href,
  title,
  date,
  imageURL,
  partialDescription,
  boldStartIndex,
  boldEndIndex,
}: NewsRowProps) {
  const { locale, localizedPath } = useLanguage();
  const dateStr = dayjs(date).locale(locale).format('YYYY년 M월 D일 ddd요일');

  return (
    <article className="flex flex-col gap-5 sm:flex-row sm:gap-6">
      <Link
        to={localizedPath(href)}
        className="relative flex aspect-4/3 sm:h-37.5"
      >
        <Image
          alt="포스트 대표 이미지"
          src={imageURL ?? undefined}
          className="h-full w-full object-cover"
        />
      </Link>
      <div className="flex flex-col justify-between gap-2.5 sm:gap-0">
        <time className="whitespace-nowrap text-sm leading-[26px] text-neutral-800 sm:order-last">
          {dateStr}
        </time>

        <div className="flex flex-col items-start">
          <Link to={localizedPath(href)} className="hover:underline">
            <h3 className="mb-2.5 text-base font-bold">{title}</h3>
          </Link>

          <Link
            to={localizedPath(href)}
            className="mb-3 line-clamp-3 break-all text-md font-normal leading-[1.6] text-neutral-500 hover:cursor-pointer"
          >
            <p className="line-clamp-2 text-md font-normal text-neutral-700">
              {partialDescription.slice(0, boldStartIndex)}
              <span className="font-semibold text-neutral-950">
                {partialDescription.slice(boldStartIndex, boldEndIndex)}
              </span>
              {partialDescription.slice(boldEndIndex)}
            </p>
          </Link>
        </div>
      </div>
    </article>
  );
}
