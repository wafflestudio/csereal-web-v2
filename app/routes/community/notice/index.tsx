import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData, useSearchParams } from 'react-router';
import Pagination from '~/components/common/Pagination';
import SearchBox from '~/components/common/SearchBox';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useCommunitySubNav } from '~/hooks/useSubNav';
import type { NoticePreview, NoticePreviewList } from '~/types/api/v2/notice';
import { getLocaleFromPathname } from '~/utils/string';
import NoticeListRow, {
  NOTICE_ROW_CELL_WIDTH,
} from './components/NoticeListRow';

const POST_LIMIT = 20;

const NOTICE_TAGS = [
  '수업',
  '장학',
  '학사(학부)',
  '학사(대학원)',
  '다전공/전과',
  '등록/복학/휴학/재입학',
  '입학',
  '졸업',
  '채용정보',
  '교환학생/유학',
  '외부행사/프로그램',
  '내부행사/프로그램',
  'international',
];

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);

  const pageNum = url.searchParams.get('pageNum') || '1';
  const keyword = url.searchParams.get('keyword') || '';
  const tag = url.searchParams.getAll('tag');

  const params = new URLSearchParams();
  params.append('pageNum', pageNum);
  params.append('language', locale);
  if (keyword) params.append('keyword', keyword);
  for (const t of tag) {
    params.append('tag', t);
  }

  const response = await fetch(`${BASE_URL}/v2/notice?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch notice posts');

  return (await response.json()) as NoticePreviewList;
}

export default function NoticePage() {
  const data = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage({ 공지사항: 'Notice', 커뮤니티: 'Community' });
  const subNav = useCommunitySubNav();

  const pageNum = parseInt(searchParams.get('pageNum') || '1', 10);
  const totalPages = Math.ceil(data.total / POST_LIMIT);

  return (
    <PageLayout
      title={t('공지사항')}
      titleSize="xl"
      breadcrumb={[
        { name: t('커뮤니티'), path: '/community' },
        { name: t('공지사항'), path: '/community/notice' },
      ]}
      subNav={subNav}
    >
      <SearchBox tags={NOTICE_TAGS} />
      <NoticeList posts={data.searchList} />
      <Pagination page={pageNum} totalPages={totalPages} />
    </PageLayout>
  );
}

interface NoticeListProps {
  posts: NoticePreview[];
}

function NoticeList({ posts }: NoticeListProps) {
  const { t } = useLanguage({
    제목: 'Title',
    날짜: 'Date',
    '검색 결과가 존재하지 않습니다.': 'No search results found.',
  });

  if (posts.length === 0) {
    return (
      <p className="mx-2.5 mb-8 mt-6">{t('검색 결과가 존재하지 않습니다.')}</p>
    );
  }

  return (
    <div className="mb-10 mt-9 border-y border-neutral-200 sm:mx-2.5">
      <h5 className="h-11 pl-12.5 hidden items-center border-b border-neutral-200 text-[15px] text-neutral-800 sm:flex">
        <span
          className={`${NOTICE_ROW_CELL_WIDTH.title} min-w-0 grow whitespace-nowrap tracking-wide sm:pl-3`}
        >
          {t('제목')}
        </span>
        <span
          className={`${NOTICE_ROW_CELL_WIDTH.date} whitespace-nowrap text-left tracking-wide sm:pl-8 sm:pr-10`}
        >
          <span className="inline-block w-20">{t('날짜')}</span>
        </span>
      </h5>
      <ul>
        {posts.map((post) => (
          <NoticeListRow key={post.id} post={post} />
        ))}
      </ul>
    </div>
  );
}
