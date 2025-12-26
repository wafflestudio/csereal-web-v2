import type { Route } from '.react-router/types/app/routes/community/notice/+types/index';
import { useState } from 'react';
import type { LoaderFunctionArgs } from 'react-router';
import { useSearchParams } from 'react-router';
import LoginVisible from '~/components/common/LoginVisible';
import Pagination from '~/components/common/Pagination';
import SearchBox from '~/components/common/SearchBox';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { NOTICE_TAGS } from '~/constants/tag';
import { useLanguage } from '~/hooks/useLanguage';
import { useSetToggle } from '~/hooks/useSetToggle';
import { useCommunitySubNav } from '~/hooks/useSubNav';
import type { NoticePreviewList } from '~/types/api/v2/notice';
import { fetchJson } from '~/utils/fetch';
import { getLocaleFromPathname } from '~/utils/string';
import AdminFeatures from './components/AdminFeatures';
import NoticeListRow, {
  NOTICE_ROW_CELL_WIDTH,
} from './components/NoticeListRow';

const POST_LIMIT = 20;

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

  return fetchJson<NoticePreviewList>(
    `${BASE_URL}/v2/notice?${params.toString()}`,
  );
}

export default function NoticePage({ loaderData: data }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage({
    제목: 'Title',
    날짜: 'Date',
    '검색 결과가 존재하지 않습니다.': 'No search results found.',
  });
  const subNav = useCommunitySubNav();

  const [isEditMode, setIsEditMode] = useState(false);
  const {
    selected: selectedIds,
    toggle: toggleSelection,
    clear,
  } = useSetToggle<number>();

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
    clear();
  };

  const pageNum = parseInt(searchParams.get('pageNum') || '1', 10);
  const totalPages = Math.ceil(data.total / POST_LIMIT);

  return (
    <PageLayout
      title={t('공지사항')}
      titleSize="xl"
      breadcrumb={[
        { name: t('소식'), path: '/community' },
        { name: t('공지사항'), path: '/community/notice' },
      ]}
      subNav={subNav}
    >
      <SearchBox tags={NOTICE_TAGS} disabled={isEditMode} />

      {data.searchList.length === 0 ? (
        <p className="mx-2.5 mb-8 mt-6">
          {t('검색 결과가 존재하지 않습니다.')}
        </p>
      ) : (
        <div className="mb-10 mt-9 border-y border-neutral-200 sm:mx-2.5">
          <h5 className="hidden h-11 items-center border-b border-neutral-200 pl-12.5 text-[15px] text-neutral-800 sm:flex">
            <span
              className={`${NOTICE_ROW_CELL_WIDTH.title} min-w-0 grow whitespace-nowrap tracking-wide sm:pl-3`}
            >
              {t('제목')}
            </span>
            <span
              className={`whitespace-nowrap text-left tracking-wide sm:pl-8 sm:pr-10`}
            >
              <span className="inline-block w-20">{t('날짜')}</span>
            </span>
          </h5>
          <ul
            className={`${
              isEditMode && 'divide-y divide-dashed divide-neutral-200'
            }`}
          >
            {data.searchList.map((post) => (
              <NoticeListRow
                key={post.id}
                post={post}
                isEditMode={isEditMode}
                isSelected={selectedIds.has(post.id)}
                onToggleSelect={() => toggleSelection(post.id)}
              />
            ))}
          </ul>
        </div>
      )}

      <Pagination
        page={pageNum}
        totalPages={totalPages}
        disabled={isEditMode}
      />

      <LoginVisible allow="ROLE_STAFF">
        <AdminFeatures
          selectedIds={selectedIds}
          isEditMode={isEditMode}
          toggleEditMode={toggleEditMode}
        />
      </LoginVisible>
    </PageLayout>
  );
}
