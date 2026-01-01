import type { Route } from '.react-router/types/app/routes/about/+types/greetings';
import type { LoaderFunctionArgs } from 'react-router';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import ContentSection from '~/components/feature/content/ContentSection';
import PageLayout from '~/components/layout/PageLayout';
import Button from '~/components/ui/Button';
import HTMLViewer from '~/components/ui/HTMLViewer';
import Image from '~/components/ui/Image';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAboutSubNav } from '~/hooks/useSubNav';
import type { AboutContent } from '~/types/api/v2/about/content';
import { processHtmlForCsp } from '~/utils/csp';
import { getLocaleFromPathname } from '~/utils/string';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);

  const response = await fetch(
    `${BASE_URL}/v2/about/greetings?language=${locale}`,
  );
  if (!response.ok) throw new Error('Failed to fetch greetings');

  const data = (await response.json()) as AboutContent;

  return {
    ...data,
    description: processHtmlForCsp(data.description),
  };
}

const META = {
  ko: {
    title: '학부장 인사말',
    description:
      '서울대학교 컴퓨터공학부 학부장의 인사말입니다. 학부의 비전과 발전 방향을 소개합니다.',
  },
  en: {
    title: 'Greetings',
    description:
      'Greetings from the chair of the Department of Computer Science and Engineering at Seoul National University.',
  },
};

export default function GreetingsPage({ loaderData }: Route.ComponentProps) {
  const { t, localizedPath, locale } = useLanguage();
  const subNav = useAboutSubNav();
  const meta = META[locale];

  return (
    <PageLayout
      title={t('학부장 인사말')}
      titleSize="xl"
      subNav={subNav}
      padding="none"
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
      <ContentSection tone="white" padding="subNav">
        <LoginVisible allow="ROLE_STAFF">
          <div className="mb-8 text-right">
            <Button
              as="link"
              to={localizedPath('/about/greetings/edit')}
              variant="outline"
              tone="neutral"
              size="md"
            >
              편집
            </Button>
          </div>
        </LoginVisible>
        <div className="flex flex-col-reverse items-start gap-6 sm:flex-row sm:gap-10">
          <div className="sm:w-100 sm:grow">
            <HTMLViewer html={loaderData.description} />
          </div>
          {loaderData.imageURL && (
            <div>
              <Image
                src={loaderData.imageURL}
                alt="학부장"
                width={212}
                height={280}
              />
            </div>
          )}
        </div>
      </ContentSection>
    </PageLayout>
  );
}
