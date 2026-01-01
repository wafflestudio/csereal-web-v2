import type { Route } from '.react-router/types/app/routes/community/notice/+types/$id';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import type { LoaderFunctionArgs } from 'react-router';
import { useNavigate } from 'react-router';
import PageLayout from '~/components/layout/PageLayout';
import Attachments from '~/components/ui/Attachments';
import HTMLViewer from '~/components/ui/HTMLViewer';
import Node from '~/components/ui/Nodes';
import { toast } from '~/components/ui/sonner';
import { Tag } from '~/components/ui/Tag';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useCommunitySubNav } from '~/hooks/useSubNav';
import PostFooter from '~/routes/community/components/PostFooter';
import type { Notice } from '~/types/api/v2/notice';
import { processHtmlForCsp } from '~/utils/csp';
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
    `${BASE_URL}/v2/notice/${id}?${searchParams.toString()}`,
    { headers },
  );

  if (!response.ok) {
    throw new Response('Not Found', { status: 404 });
  }

  const notice = (await response.json()) as Notice;

  return {
    ...notice,
    description: processHtmlForCsp(notice.description),
  };
}

export default function NoticeDetailPage({
  loaderData: notice,
}: Route.ComponentProps) {
  const { t, locale, localizedPath } = useLanguage({
    작성자: 'Author',
    '작성 날짜': 'Date',
  });
  const subNav = useCommunitySubNav();
  const navigate = useNavigate();

  // 동적 메타데이터 생성
  const pageTitle =
    locale === 'en' ? `${notice.title} | Notice` : `${notice.title} | 공지사항`;

  const pageDescription = notice.description?.html
    ? truncateDescription(stripHtml(notice.description.html))
    : locale === 'en'
      ? 'Notice details from the Department of Computer Science and Engineering at Seoul National University.'
      : '서울대학교 컴퓨터공학부 공지사항 상세 내용입니다.';

  const handleDelete = async () => {
    try {
      await fetchOk(`${BASE_URL}/v2/notice/${notice.id}`, {
        method: 'DELETE',
      });
      toast.success('게시글을 삭제했습니다.');
      navigate(localizedPath('/community/notice'));
    } catch {
      toast.error('삭제에 실패했습니다.');
    }
  };

  return (
    <PageLayout
      title={t('공지사항')}
      titleSize="xl"
      subNav={subNav}
      padding="none"
      pageTitle={pageTitle}
      pageDescription={pageDescription}
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
            {dayjs(notice.createdAt)
              .locale(locale)
              .format('YYYY/M/DD (ddd) A hh:mm')}
          </p>
        </div>
      </div>

      <div className="bg-neutral-50 px-5 pt-9 pb-36 sm:pl-[100px] sm:pr-[340px]">
        <Attachments files={notice.attachments} />

        <HTMLViewer html={notice.description} />

        <div className="h-10" />

        <Node variant="straight" />

        {notice.tags.length > 0 && (
          <div className="mt-3 ml-6 flex flex-wrap gap-2.5">
            {/* 서버에서 랜덤 순서로 오는듯  */}
            {notice.tags
              .toSorted((a, b) => a.localeCompare(b))
              .map((tag: string) => (
                <Tag
                  key={tag}
                  label={tag}
                  href={localizedPath(`/community/notice?tag=${tag}`)}
                />
              ))}
          </div>
        )}

        <PostFooter
          post={notice}
          listPath="/community/notice"
          editPath={`/community/notice/edit/${notice.id}`}
          onDelete={handleDelete}
        />
      </div>
    </PageLayout>
  );
}
