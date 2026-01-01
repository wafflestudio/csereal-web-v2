import type { Route } from '.react-router/types/app/routes/academics/$studentType/guide/+types/index';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import Attachments from '~/components/ui/Attachments';
import Button from '~/components/ui/Button';
import HTMLViewer from '~/components/ui/HTMLViewer';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import type { Guide } from '~/types/api/v2/academics';
import { processHtmlForCsp } from '~/utils/csp';
import { fetchJson } from '~/utils/fetch';

export async function loader({ params }: Route.LoaderArgs) {
  const { studentType } = params;
  const data = await fetchJson<Guide>(
    `${BASE_URL}/v2/academics/${studentType}/guide`,
  );

  return {
    ...data,
    description: processHtmlForCsp(data.description),
  };
}

const META = {
  undergraduate: {
    ko: {
      title: '학부 안내',
      description:
        '서울대학교 컴퓨터공학부 학부 과정을 안내합니다. 입학 정보, 교육 목표, 학사 일정 등 학부생을 위한 필수 정보를 제공합니다.',
    },
    en: {
      title: 'Undergraduate Guide',
      description:
        'Guide to the undergraduate program at the Department of Computer Science and Engineering, Seoul National University. Find information on admissions, educational objectives, and academic schedules.',
    },
  },
  graduate: {
    ko: {
      title: '대학원 안내',
      description:
        '서울대학교 컴퓨터공학부 대학원 과정을 안내합니다. 입학 정보, 연구 분야, 학위 과정 등 대학원생을 위한 필수 정보를 제공합니다.',
    },
    en: {
      title: 'Graduate Guide',
      description:
        'Guide to the graduate program at the Department of Computer Science and Engineering, Seoul National University. Find information on admissions, research areas, and degree programs.',
    },
  },
};

export default function GuidePage({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { studentType } = params;
  const { t, localizedPath, locale } = useLanguage();
  const subNav = useAcademicsSubNav();

  const isGraduate = studentType === 'graduate';
  const title = isGraduate ? t('대학원 안내') : t('학부 안내');
  const studentLabel = isGraduate ? t('대학원') : t('학부');
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
        <div className="mb-8 text-right">
          <Button
            as="link"
            to={localizedPath(`/academics/${studentType}/guide/edit`)}
            variant="outline"
            tone="neutral"
            size="md"
          >
            편집
          </Button>
        </div>
      </LoginVisible>
      <Attachments files={loaderData.attachments} />
      <HTMLViewer html={loaderData.description} />
    </PageLayout>
  );
}
