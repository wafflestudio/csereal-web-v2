import type { Route } from '.react-router/types/app/routes/academics/undergraduate/+types/course-changes';
import PageLayout from '~/components/layout/PageLayout';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import TimelineViewer from '~/routes/academics/components/timeline/TimelineViewer';
import type { TimelineContent } from '~/types/api/v2/academics';

export async function loader() {
  const response = await fetch(
    'https://cse.snu.ac.kr/api/v2/academics/undergraduate/course-changes',
  );
  if (!response.ok) {
    throw new Error('Failed to fetch undergraduate course changes data');
  }
  return (await response.json()) as TimelineContent[];
}

export default function UndergraduateCourseChangesPage({
  loaderData,
}: Route.ComponentProps) {
  const { t } = useLanguage({ 학년도: 'Academic Year' });
  const subNav = useAcademicsSubNav();
  const title = t('교과목 변경 내역');
  const breadcrumb = [
    { name: t('학사 및 교과'), path: '/academics' },
    { name: t('학부'), path: '/academics/undergraduate' },
    {
      name: t('교과목 변경 내역'),
      path: '/academics/undergraduate/course-changes',
    },
  ];

  return (
    <PageLayout
      title={title}
      titleSize="xl"
      breadcrumb={breadcrumb}
      subNav={subNav}
    >
      <TimelineViewer
        contents={loaderData}
        title={{ text: t('교과목 변경 내역'), unit: t('학년도') }}
      />
    </PageLayout>
  );
}
