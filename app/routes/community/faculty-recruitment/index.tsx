import type { Route } from '.react-router/types/app/routes/community/faculty-recruitment/+types/index';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import Button from '~/components/ui/Button';
import HTMLViewer from '~/components/ui/HTMLViewer';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useCommunitySubNav } from '~/hooks/useSubNav';
import type { FacultyRecruitment } from '~/types/api/v2/recruit';
import { processHtmlForCsp } from '~/utils/csp';
import { fetchJson } from '~/utils/fetch';

export async function loader() {
  const data = await fetchJson<FacultyRecruitment>(`${BASE_URL}/v2/recruit`);

  return {
    ...data,
    description: processHtmlForCsp(data.description),
  };
}

const META = {
  ko: {
    title: '신임교수초빙',
    description:
      '서울대학교 컴퓨터공학부의 신임 교수 채용 공고를 확인하세요. 지원 자격, 제출 서류, 전형 일정 등의 상세 정보를 제공합니다.',
  },
  en: {
    title: 'Faculty Recruitment',
    description:
      'Faculty recruitment announcements from the Department of Computer Science and Engineering at Seoul National University. Find details on qualifications, required documents, and application timeline.',
  },
};

export default function FacultyRecruitmentPage({
  loaderData: data,
}: Route.ComponentProps) {
  const { t, localizedPath, locale } = useLanguage();
  const subNav = useCommunitySubNav();
  const meta = META[locale];

  return (
    <PageLayout
      title={t('신임교수초빙')}
      titleSize="xl"
      subNav={subNav}
      pageTitle={meta.title}
      pageDescription={meta.description}
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
      <h1 className="my-5 text-3xl font-bold">{data.title}</h1>
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
