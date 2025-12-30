import type { Route } from '.react-router/types/app/routes/community/news/+types/$id';
import dayjs from 'dayjs';
import type { LoaderFunctionArgs } from 'react-router';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import PageLayout from '~/components/layout/PageLayout';
import Attachments from '~/components/ui/Attachments';
import HTMLViewer from '~/components/ui/HTMLViewer';
import Node from '~/components/ui/Nodes';
import { Tag } from '~/components/ui/Tag';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useCommunitySubNav } from '~/hooks/useSubNav';
import PostFooter from '~/routes/community/components/PostFooter';
import type { News } from '~/types/api/v2/news';
import { fetchOk } from '~/utils/fetch';
import { stripHtml, truncateDescription } from '~/utils/metadata';
import { getLocaleFromPathname } from '~/utils/string';

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const id = Number(params.id);

  if (!id || Number.isNaN(id)) {
    throw new Response('Invalid ID', { status: 400 });
  }

  const searchParams = new URLSearchParams();
  searchParams.append('language', locale);

  const pageNum = url.searchParams.get('pageNum');
  if (pageNum) searchParams.append('pageNum', pageNum);

  const cookie = request.headers.get('cookie');
  const headers: HeadersInit = cookie ? { Cookie: cookie } : {};

  const response = await fetch(
    `${BASE_URL}/v2/news/${id}?${searchParams.toString()}`,
    { headers },
  );

  if (!response.ok) {
    throw new Response('Not Found', { status: 404 });
  }

  return (await response.json()) as News;
}

export default function NewsDetailPage({
  loaderData: news,
}: Route.ComponentProps) {
  const { t, locale, localizedPath } = useLanguage();
  const subNav = useCommunitySubNav();
  const navigate = useNavigate();

  // 동적 메타데이터 생성
  const pageTitle =
    locale === 'en' ? `${news.title} | News` : `${news.title} | 새 소식`;

  const pageDescription = news.description
    ? truncateDescription(stripHtml(news.description))
    : locale === 'en'
      ? 'News from the Department of Computer Science and Engineering at Seoul National University.'
      : '서울대학교 컴퓨터공학부의 새 소식입니다.';

  const handleDelete = async () => {
    try {
      await fetchOk(`${BASE_URL}/v2/news/${news.id}`, {
        method: 'DELETE',
      });
      toast.success('게시글을 삭제했습니다.');
      navigate(localizedPath('/community/news'));
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <PageLayout
      title={t('새 소식')}
      titleSize="xl"
      subNav={subNav}
      padding="none"
      pageTitle={pageTitle}
      pageDescription={pageDescription}
    >
      <div className="flex flex-col gap-4 px-5 py-9 sm:pl-[100px] sm:pr-[340px]">
        <h2 className="text-[1.25rem] font-semibold leading-[1.4]">
          {news.title}
        </h2>
        <time className="text-sm font-normal tracking-wide text-neutral-500">
          {dayjs(news.date).locale(locale).format('YYYY/M/DD (ddd)')}
        </time>
      </div>

      <div className="bg-neutral-50 px-5 pt-9 pb-36 sm:pl-[100px] sm:pr-[340px]">
        <Attachments files={news.attachments} />

        <HTMLViewer
          html={news.description}
          image={
            news.imageURL && {
              src: news.imageURL,
              width: 320,
              height: 240,
              mobileFullWidth: false,
            }
          }
        />

        <div className="h-10" />

        <Node variant="straight" />

        {news.tags.length > 0 && (
          <div className="mt-3 ml-6 flex flex-wrap gap-2.5">
            {/* 서버에서 랜덤 순서로 오는듯  */}
            {news.tags
              .toSorted((a, b) => a.localeCompare(b))
              .map((tag: string) => (
                <Tag
                  key={tag}
                  label={tag}
                  href={localizedPath(`/community/news?tag=${tag}`)}
                />
              ))}
          </div>
        )}

        <PostFooter
          post={news}
          listPath="/community/news"
          editPath={`/community/news/edit/${news.id}`}
          onDelete={handleDelete}
        />
      </div>
    </PageLayout>
  );
}
