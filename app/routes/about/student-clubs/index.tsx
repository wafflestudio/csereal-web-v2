import { useLoaderData, useSearchParams } from 'react-router';
import SelectionList from '~/components/common/SelectionList';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAboutSubNav } from '~/hooks/useSubNav';
import type { StudentClubsResponse } from '~/types/api/student-clubs';
import { findItemBySearchParam, replaceSpaceWithDash } from '~/utils/string';
import ClubDetails from './components/ClubDetails';

export async function loader() {
  const response = await fetch(`${BASE_URL}/v2/about/student-clubs`);
  if (!response.ok) throw new Error('Failed to fetch student clubs');

  return (await response.json()) as StudentClubsResponse;
}

export default function StudentClubsPage() {
  const clubs = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const { t, locale } = useLanguage({
    '학생 동아리': 'Student Clubs',
    '동아리 소개': 'Student Clubs',
    '학부 소개': 'About',
  });
  const subNav = useAboutSubNav();

  const selectedClub = findItemBySearchParam(
    clubs,
    (item) => [item.en.name, item.ko.name],
    searchParams.get('selected') ?? undefined,
  );

  const selectionItems = clubs.map((club) => {
    const label = club[locale]?.name ?? club.ko.name;
    const query = replaceSpaceWithDash(club.en.name || club.ko.name);
    return {
      id: club.ko.name,
      label,
      href: `/about/student-clubs?selected=${query}`,
      selected: club.ko.name === selectedClub?.ko.name,
    };
  });

  return (
    <PageLayout
      title={t('동아리 소개')}
      titleSize="xl"
      breadcrumb={[
        { name: t('학부 소개'), path: '/about/overview' },
        { name: t('동아리 소개'), path: '/about/student-clubs' },
      ]}
      subNav={subNav}
      padding="noTop"
    >
      <SelectionList items={selectionItems} />

      {selectedClub ? (
        <ClubDetails club={selectedClub} locale={locale} />
      ) : (
        <p className="text-neutral-600">
          <b>{searchParams.get('selected')}</b>
          {locale === 'ko'
            ? '은/는 존재하지 않는 동아리입니다.'
            : ' is not a valid club.'}
        </p>
      )}
    </PageLayout>
  );
}
