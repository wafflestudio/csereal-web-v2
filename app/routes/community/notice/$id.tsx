import type { Route } from '.react-router/types/app/routes/community/notice/+types/$id';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import type { LoaderFunctionArgs } from 'react-router';
import Attachments from '~/components/common/Attachments';
import HTMLViewer from '~/components/common/HTMLViewer';
import Node from '~/components/common/Nodes';
import { Tag } from '~/components/common/Tag';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useCommunitySubNav } from '~/hooks/useSubNav';
import PostFooter from '~/routes/community/components/PostFooter';
import type { Notice } from '~/types/api/v2/notice';
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

  const response = await fetch(
    `${BASE_URL}/v2/notice/${id}?${searchParams.toString()}`,
  );

  if (!response.ok) {
    throw new Response('Not Found', { status: 404 });
  }

  return (await response.json()) as Notice;
}

export default function NoticeDetailPage({
  loaderData: notice,
}: Route.ComponentProps) {
  const { t, locale, localizedPath } = useLanguage({
    작성자: 'Author',
    '작성 날짜': 'Date',
  });
  const subNav = useCommunitySubNav();

  return (
    <PageLayout
      title={t('공지사항')}
      titleSize="xl"
      breadcrumb={[
        { name: t('소식'), path: '/community' },
        { name: t('공지사항'), path: '/community/notice' },
      ]}
      subNav={subNav}
      padding="none"
    >
      <div className="flex flex-col gap-4 px-5 py-9 sm:pl-[100px] sm:pr-[340px]">
        <h2 className="text-[1.25rem] font-semibold leading-[1.4]">
          {notice.title}
        </h2>
        <div className="flex gap-5 text-sm font-normal tracking-wide text-neutral-500">
          <p>
            {t('작성자')}: {notice.author}
          </p>
          <p>
            {t('작성 날짜')}:{' '}
            {dayjs(notice.createdAt).locale(locale).format('YYYY/M/DD (ddd) A hh:mm')}
          </p>
        </div>
      </div>

      <div className="bg-neutral-50 px-5 pt-9 pb-16 sm:pl-[100px] sm:pr-[340px]">
        <Attachments files={notice.attachments} />

        <HTMLViewer html={notice.description} />

        <Node variant="straight" />

        {notice.tags.length > 0 && (
          <div className="mt-3 ml-6 flex flex-wrap gap-2.5">
            {notice.tags.map((tag: string) => (
              <Tag
                key={tag}
                label={tag}
                href={localizedPath(`/community/notice?tag=${tag}`)}
              />
            ))}
          </div>
        )}

        <PostFooter post={notice} listPath="/community/notice" />
      </div>
    </PageLayout>
  );
}
