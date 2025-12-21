import type { Route } from '.react-router/types/app/routes/academics/undergraduate/+types/general-studies-requirements';
import PageLayout from '~/components/layout/PageLayout';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import TimelineViewer from '~/routes/academics/components/timeline/TimelineViewer';
import type { TimelineContent } from '~/types/api/v2/academics';

const OVERVIEW =
  '컴퓨터공학부 학생이 졸업을 하기 위해 반드시 들어야 하는 영역별 교양과목 학점 배분 구조표입니다. 학부생들은 아래의 구조표를 참고하여 수강에 차질이 없도록 하여야 합니다.';

export async function loader() {
  const response = await fetch(
    'https://cse.snu.ac.kr/api/v2/academics/undergraduate/general-studies-requirements',
  );
  if (!response.ok) {
    throw new Error('Failed to fetch general studies requirements data');
  }
  return (await response.json()) as TimelineContent[];
}

export default function GeneralStudiesRequirementsPage({
  loaderData,
}: Route.ComponentProps) {
  const { t } = useLanguage({
    '영역별 교양과목 학점 배분 구조표':
      'Distribution of Liberal Arts Credits by Area',
    학번: 'Student ID',
    [OVERVIEW]:
      'This is the distribution table of required liberal arts credits by area for CSE undergraduates. Students should refer to the table below when planning their coursework.',
  });
  const subNav = useAcademicsSubNav();
  const title = t('필수 교양 과목');
  const breadcrumb = [
    { name: t('학사 및 교과'), path: '/academics' },
    { name: t('학부'), path: '/academics/undergraduate' },
    {
      name: t('필수 교양 과목'),
      path: '/academics/undergraduate/general-studies-requirements',
    },
  ];

  return (
    <PageLayout
      title={title}
      titleSize="xl"
      breadcrumb={breadcrumb}
      subNav={subNav}
    >
      <p className="mb-10 bg-neutral-100 px-6 py-5 text-md leading-loose">
        {t(OVERVIEW)}
      </p>
      <TimelineViewer
        contents={loaderData}
        title={{ text: t('영역별 교양과목 학점 배분 구조표'), unit: t('학번') }}
      />
    </PageLayout>
  );
}
