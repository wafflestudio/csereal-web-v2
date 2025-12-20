import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData } from 'react-router';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAboutSubNav } from '~/hooks/useSubNav';
import type { FacilitiesResponse } from '~/types/api/facilities';
import { getLocaleFromPathname } from '~/utils/string';
import FacilitiesList from './components/FacilitiesList';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const response = await fetch(`${BASE_URL}/v2/about/facilities`);
  if (!response.ok) throw new Error('Failed to fetch facilities');

  const facilities = (await response.json()) as FacilitiesResponse;
  return facilities.map((facility) => facility[locale]);
}

export default function FacilitiesPage() {
  const facilities = useLoaderData<typeof loader>();
  const { t } = useLanguage({ '시설 안내': 'Facilities' });
  const subNav = useAboutSubNav();

  return (
    <PageLayout
      title={t('시설 안내')}
      titleSize="xl"
      breadcrumb={[
        { name: t('학부 소개'), path: '/about/overview' },
        { name: t('시설 안내'), path: '/about/facilities' },
      ]}
      subNav={subNav}
    >
      <FacilitiesList facilities={facilities} />
    </PageLayout>
  );
}
