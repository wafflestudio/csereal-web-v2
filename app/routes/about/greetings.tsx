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
import { getLocaleFromPathname } from '~/utils/string';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);

  const response = await fetch(
    `${BASE_URL}/v2/about/greetings?language=${locale}`,
  );
  if (!response.ok) throw new Error('Failed to fetch greetings');

  return (await response.json()) as AboutContent;
}

export default function GreetingsPage({ loaderData }: Route.ComponentProps) {
  const { t, localizedPath } = useLanguage();
  const subNav = useAboutSubNav();

  return (
    <PageLayout
      title={t('학부장 인사말')}
      titleSize="xl"
      subNav={subNav}
      padding="none"
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
