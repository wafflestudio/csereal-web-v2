import type { Route } from '.react-router/types/app/routes/academics/$studentType/scholarship/+types/index';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import Button from '~/components/ui/Button';
import HTMLViewer from '~/components/ui/HTMLViewer';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import ScholarshipList from '~/routes/academics/components/ScholarshipList';
import type { StudentType } from '~/types/api/v2/academics';
import type { ScholarshipList as ScholarshipListType } from '~/types/api/v2/academics/scholarship';
import { processHtmlForCsp } from '~/utils/csp';
import { fetchJson } from '~/utils/fetch';

export async function loader({ params }: Route.LoaderArgs) {
  const { studentType } = params;
  const data = await fetchJson<ScholarshipListType>(
    `${BASE_URL}/v2/academics/${studentType}/scholarship`,
  );

  return {
    ...data,
    description: processHtmlForCsp(data.description),
  };
}

const META = {
  undergraduate: {
    ko: {
      title: '장학 제도',
      description:
        '서울대학교 컴퓨터공학부 학부생을 위한 장학 제도를 안내합니다. 다양한 장학금 종류와 지원 자격, 신청 방법을 확인하실 수 있습니다.',
    },
    en: {
      title: 'Scholarships',
      description:
        'Scholarship programs for undergraduate students at the Department of Computer Science and Engineering, Seoul National University. Find information on various scholarships, eligibility, and application procedures.',
    },
  },
  graduate: {
    ko: {
      title: '장학 제도',
      description:
        '서울대학교 컴퓨터공학부 대학원생을 위한 장학 제도를 안내합니다. 다양한 장학금 종류와 지원 자격, 신청 방법을 확인하실 수 있습니다.',
    },
    en: {
      title: 'Scholarships',
      description:
        'Scholarship programs for graduate students at the Department of Computer Science and Engineering, Seoul National University. Find information on various scholarships, eligibility, and application procedures.',
    },
  },
};

export default function ScholarshipPage({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { studentType } = params;
  const { t, locale } = useLanguage();
  const subNav = useAcademicsSubNav();

  const title = t('장학 제도');
  const studentLabel = studentType === 'graduate' ? t('대학원') : t('학부');
  const meta = META[studentType as 'undergraduate' | 'graduate'][locale];

  return (
    <PageLayout
      title={title}
      titleSize="xl"
      subNav={subNav}
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-8 flex justify-end">
          <Button variant="outline" tone="neutral" as="link" to="edit">
            편집
          </Button>
        </div>
      </LoginVisible>
      <HTMLViewer html={loaderData.description} />
      <ScholarshipList
        scholarships={loaderData.scholarships}
        studentType={studentType as StudentType}
      />
      <LoginVisible allow="ROLE_STAFF">
        <div className="mt-3">
          <Button
            variant="outline"
            tone="brand"
            as="link"
            to="create"
            iconLeft="add"
          >
            장학금 추가
          </Button>
        </div>
      </LoginVisible>
    </PageLayout>
  );
}
