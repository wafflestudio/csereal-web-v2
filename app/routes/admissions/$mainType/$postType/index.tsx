import type { Route } from '.react-router/types/app/routes/admissions/$mainType/$postType/+types/index';
import { getLocaleFromPathname } from '~/utils/string';
import AdmissionsPageContent from '../../components/AdmissionsPageContent';
import { fetchAdmissions } from '../../components/fetchAdmissions';

// Mapping for page configuration
const ADMISSIONS_PAGES: Record<
  string,
  Record<string, { apiPostType: string; layout?: 'default' | 'extraBottom' }>
> = {
  undergraduate: {
    'regular-admission': { apiPostType: 'regular-admission' },
    'early-admission': { apiPostType: 'early-admission' },
  },
  graduate: {
    'regular-admission': { apiPostType: 'regular-admission' },
  },
  international: {
    undergraduate: { apiPostType: 'undergraduate' },
    graduate: { apiPostType: 'graduate' },
    exchange: { apiPostType: 'exchange-visiting', layout: 'extraBottom' },
    scholarships: { apiPostType: 'scholarships', layout: 'extraBottom' },
  },
};

export async function loader({ request, params }: Route.LoaderArgs) {
  const { mainType, postType } = params;
  const config = ADMISSIONS_PAGES[mainType]?.[postType];

  if (!config) {
    throw new Error(`Invalid admissions page: ${mainType}/${postType}`);
  }

  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const data = await fetchAdmissions(
    mainType as 'undergraduate' | 'graduate' | 'international',
    config.apiPostType as any,
  );

  return { description: data[locale].description, layout: config.layout };
}

export default function AdmissionsPage({
  loaderData: { description, layout },
}: Route.ComponentProps) {
  return <AdmissionsPageContent description={description} layout={layout} />;
}
