import type { Route } from '.react-router/types/app/routes/academics/undergraduate/degree-requirements/+types/index';
import { Link } from 'react-router';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import Attachments from '~/components/ui/Attachments';
import Button from '~/components/ui/Button';
import HTMLViewer from '~/components/ui/HTMLViewer';
import Node from '~/components/ui/Nodes';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import type { DegreeRequirements } from '~/types/api/v2/academics/undergraduate/degree-requirements';
import { processHtmlForCsp } from '~/utils/csp';
import { fetchJson } from '~/utils/fetch';

export async function loader() {
  const data = await fetchJson<DegreeRequirements>(
    `${BASE_URL}/v2/academics/undergraduate/degree-requirements`,
  );

  return {
    ...data,
    description: processHtmlForCsp(data.description),
  };
}

const META = {
  ko: {
    title: '졸업 규정',
    description:
      '서울대학교 컴퓨터공학부 학부 졸업 규정을 안내합니다. 졸업 요건, 학점 이수 기준, 졸업 사정 유의사항 등을 확인하실 수 있습니다.',
  },
  en: {
    title: 'Degree Requirements',
    description:
      'Degree requirements for the undergraduate program at the Department of Computer Science and Engineering, Seoul National University. Find graduation requirements, credit standards, and graduation review notes.',
  },
};

export default function DegreeRequirementsPage({
  loaderData,
}: Route.ComponentProps) {
  const { t, locale } = useLanguage({
    '공통: 졸업사정 유의사항': 'Common: Graduation Review Notes',
  });
  const subNav = useAcademicsSubNav();
  const title = t('졸업 규정');
  const meta = META[locale];

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
      <Attachments files={loaderData.attachments} />
      <div className="mb-7 mt-6 flex w-[200px] flex-col">
        <h3 className="mb-2 pl-3 text-lg font-bold">
          {t('공통: 졸업사정 유의사항')}
        </h3>
        <Node variant="straight" />
      </div>
      <HTMLViewer html={loaderData.description} />
    </PageLayout>
  );
}
