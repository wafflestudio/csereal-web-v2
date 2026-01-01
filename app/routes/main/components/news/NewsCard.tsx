import dayjs from 'dayjs';
import { Link } from 'react-router';
import Image from '~/components/ui/Image';
import { useLanguage } from '~/hooks/useLanguage';
import type { MainNews } from '~/types/api/v2';
import { CARD_WIDTH_TAILWIND } from './constants';

export default function NewsCard({ news }: { news: MainNews }) {
  const { localizedPath } = useLanguage();

  return (
    <Link
      to={localizedPath(`/community/news/${news.id}`)}
      className={`flex h-76 shrink-0 flex-col bg-neutral-50 shadow-[0_0_31.9px_0_rgba(0,0,0,0.07)] ${CARD_WIDTH_TAILWIND}`}
    >
      <div className="relative h-25 w-full">
        <Image
          src={encodeURI(news.imageURL)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="px-[0.87rem] pt-[0.88rem]">
        <h3 className="line-clamp-2 text-[0.9375rem] font-semibold text-neutral-900">
          {news.title}
        </h3>
        <time className="mt-3 block text-sm font-normal text-neutral-500">
          {dayjs(news.createdAt).format('YYYY/M/DD')}
        </time>
        <p className="mt-3 line-clamp-4 text-sm font-normal leading-[150%] text-neutral-500">
          {news.description}
        </p>
      </div>
    </Link>
  );
}
