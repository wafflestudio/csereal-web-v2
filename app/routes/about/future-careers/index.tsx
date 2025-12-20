import { type LoaderFunctionArgs, useLoaderData } from 'react-router';
import ContentSection from '~/components/common/ContentSection';
import HTMLViewer from '~/components/common/HTMLViewer';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAboutSubNav } from '~/hooks/useSubNav';
import type { FutureCareersResponse } from '~/types/api/future-careers';
import { getLocaleFromPathname } from '~/utils/string';
import CareerCompanies from './components/CareerCompanies';
import CareerStat from './components/CareerStat';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);

  const response = await fetch(
    `${BASE_URL}/v2/about/future-careers?language=${locale}`,
  );
  if (!response.ok) throw new Error('Failed to fetch future careers');

  return (await response.json()) as FutureCareersResponse;
}

export default function FutureCareersPage() {
  const data = useLoaderData<typeof loader>();
  const { t } = useLanguage({
    '졸업생 진로': 'Career Paths',
  });
  const subNav = useAboutSubNav();

  return (
    <PageLayout
      title={t('졸업생 진로')}
      titleSize="xl"
      breadcrumb={[
        { name: t('학부 소개'), path: '/about/overview' },
        { name: t('졸업생 진로'), path: '/about/future-careers' },
      ]}
      subNav={subNav}
      padding="none"
    >
      <ContentSection tone="white" padding="subNav">
        <HTMLViewer html={data.description} />
        <CareerStat stat={data.stat} />
        <CareerCompanies companies={data.companies} />
      </ContentSection>
    </PageLayout>
  );
}
