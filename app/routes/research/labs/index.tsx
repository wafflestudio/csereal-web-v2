import type { Route } from '.react-router/types/app/routes/research/labs/+types/index';
import type { LoaderFunctionArgs } from 'react-router';
import Button from '~/components/common/Button';
import LoginVisible from '~/components/common/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useResearchSubNav } from '~/hooks/useSubNav';
import ResearchLabListRow from '~/routes/research/labs/component/ResearchLabRow';
import type { SimpleResearchLab } from '~/types/api/v2/research/labs';
import { getLocaleFromPathname } from '~/utils/string';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);

  const params = new URLSearchParams();
  params.append('language', locale);

  const response = await fetch(
    `${BASE_URL}/v2/research/lab?${params.toString()}`,
  );
  if (!response.ok) throw new Error('Failed to fetch research labs');

  return (await response.json()) as SimpleResearchLab[];
}

export default function ResearchLabsPage({
  loaderData: labs,
}: Route.ComponentProps) {
  const { t, localizedPath } = useLanguage({
    '연구실 목록': 'Laboratories',
    연구·교육: 'Research & Edu',
    연구실: 'Lab',
    지도교수: 'Professor',
    '연구실 위치': 'Location',
    전화: 'Tel',
    약자: 'Acronym',
    '소개 자료': 'Materials',
  });
  const subNav = useResearchSubNav();

  return (
    <PageLayout
      title={t('연구실 목록')}
      titleSize="xl"
      breadcrumb={[
        { name: t('연구·교육'), path: '/research' },
        { name: t('연구실 목록'), path: '/research/labs' },
      ]}
      subNav={subNav}
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-9 text-right">
          <Button
            as="link"
            to={localizedPath('/research/labs/create')}
            variant="solid"
            tone="brand"
            size="md"
          >
            연구실 추가
          </Button>
        </div>
      </LoginVisible>

      <div className="sm:border-y sm:border-neutral-200">
        <h4 className="hidden h-10 items-center gap-2 whitespace-nowrap bg-neutral-100 px-2 text-sm font-medium tracking-[0.02em] sm:flex">
          <span className={LAB_ROW_ITEM_WIDTH.name}>{t('연구실')}</span>
          <span className={LAB_ROW_ITEM_WIDTH.professor}>{t('지도교수')}</span>
          <span className={LAB_ROW_ITEM_WIDTH.location}>
            {t('연구실 위치')}
          </span>
          <span className={LAB_ROW_ITEM_WIDTH.tel}>{t('전화')}</span>
          <span className={LAB_ROW_ITEM_WIDTH.acronym}>{t('약자')}</span>
          <span className={LAB_ROW_ITEM_WIDTH.introMaterial}>
            {t('소개 자료')}
          </span>
        </h4>

        <ul className="sm:divide-y sm:divide-dashed sm:divide-neutral-200">
          {labs.map((lab) => (
            <ResearchLabListRow
              key={lab.id}
              lab={lab}
              localizedPath={localizedPath}
              labelProfessor={t('지도교수')}
            />
          ))}
        </ul>
      </div>
    </PageLayout>
  );
}

export const LAB_ROW_ITEM_WIDTH = {
  name: 'sm:w-[14.5rem]',
  professor: 'sm:w-[6.875rem]',
  location: 'sm:w-[12.5rem]',
  tel: 'sm:w-[7.5rem]',
  acronym: 'sm:w-20',
  introMaterial: 'sm:w-[5.625rem]',
} as const;
