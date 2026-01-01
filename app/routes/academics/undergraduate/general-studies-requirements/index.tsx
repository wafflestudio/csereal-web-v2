import type { Route } from '.react-router/types/app/routes/academics/undergraduate/general-studies-requirements/+types/index';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import TimelineViewer from '~/routes/academics/components/timeline/TimelineViewer';
import type { TimelineContent } from '~/types/api/v2/academics';
import { processHtmlForCsp } from '~/utils/csp';
import { fetchJson } from '~/utils/fetch';

const OVERVIEW =
  '컴퓨터공학부 학생이 졸업을 하기 위해 반드시 들어야 하는 영역별 교양과목 학점 배분 구조표입니다. 학부생들은 아래의 구조표를 참고하여 수강에 차질이 없도록 하여야 합니다.';

export async function loader() {
  const data = await fetchJson<TimelineContent[]>(
    `${BASE_URL}/v2/academics/undergraduate/general-studies-requirements`,
  );

  return data.map((item) => ({
    ...item,
    description: processHtmlForCsp(item.description),
  }));
}

const META = {
  ko: {
    title: '필수 교양 과목',
    description:
      '서울대학교 컴퓨터공학부 학부생을 위한 필수 교양 과목 안내입니다. 영역별 교양 학점 배분 구조와 이수 요건을 확인하실 수 있습니다.',
  },
  en: {
    title: 'General Studies Requirements',
    description:
      'General studies requirements for undergraduate students at the Department of Computer Science and Engineering, Seoul National University. Find credit distribution and requirements by area.',
  },
};

export default function GeneralStudiesRequirementsPage({
  loaderData,
}: Route.ComponentProps) {
  const { t, locale } = useLanguage({
    '영역별 교양과목 학점 배분 구조표':
      'Distribution of Liberal Arts Credits by Area',
    학번: 'Student ID',
    [OVERVIEW]:
      'This is the distribution table of required liberal arts credits by area for CSE undergraduates. Students should refer to the table below when planning their coursework.',
  });
  const subNav = useAcademicsSubNav();
  const meta = META[locale];

  return (
    <PageLayout
      title={t('필수 교양 과목')}
      titleSize="xl"
      subNav={subNav}
      pageTitle={meta.title}
      pageDescription={meta.description}
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
