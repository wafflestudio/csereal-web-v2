import type { Route } from '.react-router/types/app/routes/academics/graduate/+types/guide';
import Attachments from '~/components/common/Attachments';
import HTMLViewer from '~/components/common/HTMLViewer';
import PageLayout from '~/components/layout/PageLayout';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import type { Guide } from '~/types/api/v2/academics';

export async function loader() {
  const response = await fetch(
    'https://cse.snu.ac.kr/api/v2/academics/graduate/guide',
  );
  if (!response.ok) {
    throw new Error('Failed to fetch graduate guide data');
  }

  return (await response.json()) as Guide;
}

export default function GraduateGuidePage({
  loaderData,
}: Route.ComponentProps) {
  const { t } = useLanguage();
  const subNav = useAcademicsSubNav();

  const title = t('대학원 안내');
  const breadcrumb = [
    { path: '/academics', name: t('학사 및 교과') },
    { name: t('대학원') },
    { path: '/academics/graduate/guide', name: t('대학원 안내') },
  ];

  return (
    <PageLayout
      title={title}
      titleSize="xl"
      breadcrumb={breadcrumb}
      subNav={subNav}
    >
      <Attachments files={loaderData.attachments} />
      <HTMLViewer html={loaderData.description} />
    </PageLayout>
  );
}
