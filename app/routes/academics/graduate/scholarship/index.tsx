import type { Route } from '.react-router/types/app/routes/academics/graduate/scholarship/+types/index';
import HTMLViewer from '~/components/common/HTMLViewer';
import PageLayout from '~/components/layout/PageLayout';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import ScholarshipList from '~/routes/academics/components/ScholarshipList';
import type { ScholarshipList as ScholarshipListType } from '~/types/api/v2/academics/scholarship';

export async function loader() {
  const response = await fetch(
    'https://cse.snu.ac.kr/api/v2/academics/graduate/scholarship',
  );
  if (!response.ok) {
    throw new Error('Failed to fetch graduate scholarship data');
  }

  return (await response.json()) as ScholarshipListType;
}

export default function GraduateScholarshipPage({
  loaderData,
}: Route.ComponentProps) {
  const { t } = useLanguage();
  const subNav = useAcademicsSubNav();

  const title = t('장학 제도');
  const breadcrumb = [
    { path: '/academics', name: t('학사 및 교과') },
    { name: t('대학원') },
    { path: '/academics/graduate/scholarship', name: t('장학 제도') },
  ];

  return (
    <PageLayout
      title={title}
      titleSize="xl"
      breadcrumb={breadcrumb}
      subNav={subNav}
    >
      <HTMLViewer html={loaderData.description} />
      <ScholarshipList
        scholarships={loaderData.scholarships}
        studentType="graduate"
      />
    </PageLayout>
  );
}
