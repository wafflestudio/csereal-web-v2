import type { Route } from '.react-router/types/app/routes/community/faculty-recruitment/+types/index';
import Button from '~/components/common/Button';
import HTMLViewer from '~/components/common/HTMLViewer';
import LoginVisible from '~/components/common/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useCommunitySubNav } from '~/hooks/useSubNav';
import type { FacultyRecruitment } from '~/types/api/v2/recruit';
import { fetchJson } from '~/utils/fetch';

export async function loader() {
  return fetchJson<FacultyRecruitment>(`${BASE_URL}/v2/recruit`);
}

export default function FacultyRecruitmentPage({
  loaderData: data,
}: Route.ComponentProps) {
  const { t, localizedPath } = useLanguage();
  const subNav = useCommunitySubNav();

  return (
    <PageLayout
      title={t('신임교수초빙')}
      titleSize="xl"
      breadcrumb={[
        { name: t('소식'), path: '/community' },
        { name: t('신임교수초빙'), path: '/community/faculty-recruitment' },
      ]}
      subNav={subNav}
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-8 text-right">
          <Button
            variant="solid"
            tone="inverse"
            size="md"
            as="link"
            to={localizedPath('/community/faculty-recruitment/edit')}
          >
            편집
          </Button>
        </div>
      </LoginVisible>

      <HTMLViewer
        html={data.description}
        image={
          data.mainImageUrl
            ? { src: data.mainImageUrl, width: 200, height: 200 }
            : undefined
        }
      />
    </PageLayout>
  );
}
