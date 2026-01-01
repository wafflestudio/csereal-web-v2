import type { Route } from '.react-router/types/app/routes/about/student-clubs/+types/index';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import SelectionList from '~/components/feature/selection/SelectionList';
import PageLayout from '~/components/layout/PageLayout';
import Button from '~/components/ui/Button';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useSelectionList } from '~/hooks/useSelectionList';
import { useAboutSubNav } from '~/hooks/useSubNav';
import type { StudentClubsResponse } from '~/types/api/v2/about/student-clubs';
import { processHtmlForCsp } from '~/utils/csp';
import { fetchJson } from '~/utils/fetch';
import ClubDetails from './components/ClubDetails';

export async function loader() {
  const response = await fetchJson<StudentClubsResponse>(
    `${BASE_URL}/v2/about/student-clubs`,
  );

  return response.map((club) => ({
    ko: {
      ...club.ko,
      description: processHtmlForCsp(club.ko.description),
    },
    en: {
      ...club.en,
      description: processHtmlForCsp(club.en.description),
    },
  }));
}

const META = {
  ko: {
    title: '동아리 소개',
    description:
      '서울대학교 컴퓨터공학부 학생 동아리를 소개합니다. 프로그래밍, 알고리즘, 보안, 게임 개발 등 다양한 분야의 학술 동아리와 활동 내용을 확인하실 수 있습니다.',
  },
  en: {
    title: 'Student Clubs',
    description:
      'Student clubs of the Department of Computer Science and Engineering at Seoul National University. Explore various academic clubs in programming, algorithms, security, game development, and more.',
  },
};

export default function StudentClubsPage({
  loaderData: clubs,
}: Route.ComponentProps) {
  const { t, locale, localizedPath } = useLanguage({
    '학생 동아리': 'Student Clubs',
    '동아리 소개': 'Student Clubs',
    '학부 소개': 'About',
  });
  const subNav = useAboutSubNav();
  const meta = META[locale];

  const { selectedItem: selectedClub, selectionItems } = useSelectionList({
    items: clubs,
    getItem: (club) => ({ id: club[locale].id, label: club[locale].name }),
  });

  return (
    <PageLayout
      title={t('동아리 소개')}
      titleSize="xl"
      subNav={subNav}
      padding="noTop"
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="mt-11 text-right">
          <Button
            as="link"
            to={localizedPath('/about/student-clubs/create')}
            variant="solid"
            tone="brand"
            size="md"
          >
            동아리 추가
          </Button>
        </div>
      </LoginVisible>

      <SelectionList items={selectionItems} />
      {selectedClub && <ClubDetails club={selectedClub} locale={locale} />}
    </PageLayout>
  );
}
