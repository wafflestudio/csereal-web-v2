import type { Route } from '.react-router/types/app/routes/academics/undergraduate/curriculum/+types/index';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import TimelineViewer from '~/routes/academics/components/timeline/TimelineViewer';
import type { TimelineContent } from '~/types/api/v2/academics';
import { processHtmlForCsp } from '~/utils/csp';
import { fetchJson } from '~/utils/fetch';

import './assets/curriculumfix.css';

export async function loader() {
  const data = await fetchJson<TimelineContent[]>(
    `${BASE_URL}/v2/academics/undergraduate/curriculum`,
  );

  return data.map((item) => ({
    ...item,
    description: processHtmlForCsp(item.description),
  }));
}

const META = {
  ko: {
    title: '전공 이수 표준 형태',
    description:
      '서울대학교 컴퓨터공학부 학부 전공 이수 표준 형태를 안내합니다. 학번별 권장 이수 과정과 졸업 요건을 확인하실 수 있습니다.',
  },
  en: {
    title: 'Standard Curriculum',
    description:
      'Standard curriculum for the undergraduate program at the Department of Computer Science and Engineering, Seoul National University. Find recommended course sequences and graduation requirements by student ID.',
  },
};

export default function UndergraduateCurriculumPage({
  loaderData,
}: Route.ComponentProps) {
  const { t, locale } = useLanguage({ 학번: 'Student ID' });
  const subNav = useAcademicsSubNav();
  const title = t('전공 이수 표준 형태');
  const meta = META[locale];

  return (
    <PageLayout
      title={title}
      titleSize="xl"
      subNav={subNav}
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
      <TimelineViewer
        contents={loaderData}
        title={{ text: t('전공 이수 표준 형태'), unit: t('학번') }}
      />
    </PageLayout>
  );
}
