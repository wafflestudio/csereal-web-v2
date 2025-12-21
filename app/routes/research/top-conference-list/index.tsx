import type { Route } from '.react-router/types/app/routes/research/top-conference-list/+types/index';
import dayjs from 'dayjs';
import type { LoaderFunctionArgs } from 'react-router';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useResearchSubNav } from '~/hooks/useSubNav';
import type { TopConferenceListResponse } from '~/types/api/v2/conference';
import { getLocaleFromPathname } from '~/utils/string';
import ConferenceListTable from './components/ConferenceListTable';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);

  const response = await fetch(
    `${BASE_URL}/v2/conference/page?language=${locale}`,
  );
  if (!response.ok) throw new Error('Failed to fetch top conference list');

  return (await response.json()) as TopConferenceListResponse;
}

export default function TopConferenceListPage({
  loaderData,
}: Route.ComponentProps) {
  const { t, locale } = useLanguage({
    '서울대학교 공과대학 컴퓨터공학부':
      'Department of Computer Science and Engineering, Seoul National University',
    '본 리스트는 시간과 상황의 변동에 따라 바뀔 수 있습니다':
      'This list may change depending on time and circumstances',
    '수정 날짜': 'Last updated',
    작성자: 'Author',
  });
  const subNav = useResearchSubNav();
  const { modifiedAt, author, conferenceList } = loaderData;

  const dateStr = dayjs(modifiedAt)
    .locale(locale)
    .format(locale === 'en' ? 'MMM D, YYYY' : 'YYYY. M. D');

  return (
    <PageLayout
      title={t('Top Conference List')}
      titleSize="xl"
      breadcrumb={[
        { name: t('연구·교육'), path: '/research' },
        {
          name: t('Top Conference List'),
          path: '/research/top-conference-list',
        },
      ]}
      subNav={subNav}
    >
      <div className="flex flex-col text-neutral-950">
        <h3 className="mb-5 text-base font-bold leading-8">
          {t('서울대학교 공과대학 컴퓨터공학부')} Top Conference List
        </h3>
        <p className="text-md leading-[26px]">
          {t('본 리스트는 시간과 상황의 변동에 따라 바뀔 수 있습니다')}.
        </p>
        <p className="text-md leading-[26px]">
          {t('수정 날짜')}: {dateStr}
          <br />
          {t('작성자')}: {author}
        </p>
        <ConferenceListTable conferenceList={conferenceList} />
      </div>
    </PageLayout>
  );
}
