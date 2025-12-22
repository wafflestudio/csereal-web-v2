import type { Route } from '.react-router/types/app/routes/academics/undergraduate/scholarship/+types/index';
import HTMLViewer from '~/components/common/HTMLViewer';
import PageLayout from '~/components/layout/PageLayout';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import ScholarshipList from '~/routes/academics/components/ScholarshipList';
import type { ScholarshipList as ScholarshipListType } from '~/types/api/v2/academics/scholarship';

export async function loader() {
  const response = await fetch(
    'https://cse.snu.ac.kr/api/v2/academics/undergraduate/scholarship',
  );
  if (!response.ok) {
    throw new Error('Failed to fetch undergraduate scholarship data');
  }

  return (await response.json()) as ScholarshipListType;
}

export default function UndergraduateScholarshipPage({
  loaderData,
}: Route.ComponentProps) {
  const { t } = useLanguage();
  const subNav = useAcademicsSubNav();

  const title = t('장학 제도');
  const breadcrumb = [
    { path: '/academics', name: t('학사 및 교과') },
    { name: t('학부') },
    { path: '/academics/undergraduate/scholarship', name: t('장학 제도') },
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
        studentType="undergraduate"
      />
    </PageLayout>
  );
}
