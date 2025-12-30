import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { Link, useSearchParams } from 'react-router';
import Image from '~/components/ui/Image';
import { Tag } from '~/components/ui/Tag';
import { useLanguage } from '~/hooks/useLanguage';
import type { NewsPreview } from '~/types/api/v2/news';

interface NewsListRowProps {
  post: NewsPreview;
}

export default function NewsListRow({ post }: NewsListRowProps) {
  const { locale, localizedPath, tUnsafe } = useLanguage();
  const [searchParams] = useSearchParams();

  const detailPathBase = localizedPath(`/community/news/${post.id}`);
  const pageNum = searchParams.get('pageNum');
  const detailPath = pageNum
    ? `${detailPathBase}?pageNum=${pageNum}`
    : detailPathBase;

  return (
    <article className="flex flex-col-reverse gap-4 border-b border-neutral-100 pb-5 sm:flex-row sm:gap-8">
      <div className="flex flex-1 flex-col justify-between break-keep">
        <time className="mb-2.5 mt-5 text-md text-neutral-800 sm:hidden">
          {dayjs(post.date).locale(locale).format('YYYY/M/DD (ddd)')}
        </time>

        <div className="flex flex-col items-start">
          <Link to={detailPath} className="hover:underline">
            <h3 className="mb-2.5 text-base font-bold">{post.title}</h3>
          </Link>

          <Link
            to={detailPath}
            className="mb-3 line-clamp-3 break-all text-md font-normal leading-[1.6] text-neutral-500 hover:cursor-pointer sm:mb-8"
          >
            {post.description}...
          </Link>
        </div>

        <div className="flex items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            {post.tags.map((tag) => (
              <Tag
                key={tag}
                label={tUnsafe(tag)}
                href={localizedPath(`/community/news?tag=${tag}`)}
              />
            ))}
          </div>
          <time className="hidden self-end whitespace-nowrap text-sm leading-[26px] text-neutral-800 sm:inline">
            {dayjs(post.date).locale(locale).format('YYYY/M/DD (ddd)')}
          </time>
        </div>
      </div>

      {post.imageURL ? (
        <Link to={detailPath} className="relative flex aspect-4/3 sm:h-37.5">
          <Image
            src={post.imageURL}
            alt="포스트 대표 이미지"
            className="h-full w-full object-cover"
          />
        </Link>
      ) : (
        <div className="hidden sm:block sm:h-37.5 sm:w-50 sm:bg-neutral-100" />
      )}
    </article>
  );
}
