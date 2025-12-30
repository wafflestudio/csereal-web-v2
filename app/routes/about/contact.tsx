import type { Route } from '.react-router/types/app/routes/about/+types/contact';
import type { LoaderFunctionArgs } from 'react-router';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import ContentSection from '~/components/feature/content/ContentSection';
import PageLayout from '~/components/layout/PageLayout';
import Button from '~/components/ui/Button';
import HTMLViewer from '~/components/ui/HTMLViewer';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAboutSubNav } from '~/hooks/useSubNav';
import { getLocaleFromPathname } from '~/utils/string';

import './assets/contactfix.css';

interface ContactResponse {
  description: string;
  imageURL: string | null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const response = await fetch(
    `${BASE_URL}/v2/about/contact?language=${locale}`,
  );
  if (!response.ok) throw new Error('Failed to fetch contact');

  return (await response.json()) as ContactResponse;
}

const META = {
  ko: {
    title: '연락처',
    description:
      '서울대학교 컴퓨터공학부의 연락처 정보입니다. 학부 사무실 위치, 전화번호, 이메일 등의 정보를 확인하실 수 있습니다.',
  },
  en: {
    title: 'Contact',
    description:
      'Contact information for the Department of Computer Science and Engineering at Seoul National University. Find office location, phone number, and email.',
  },
};

export default function ContactPage({
  loaderData: { description, imageURL },
}: Route.ComponentProps) {
  const { t, localizedPath, locale } = useLanguage({ 연락처: 'Contact' });
  const subNav = useAboutSubNav();
  const meta = META[locale];

  return (
    <PageLayout
      title={t('연락처')}
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
              to={localizedPath('/about/contact/edit')}
              variant="outline"
              tone="neutral"
              size="md"
            >
              편집
            </Button>
          </div>
        </LoginVisible>
        <HTMLViewer
          html={description}
          image={
            imageURL && {
              src: imageURL,
              width: 240,
              height: 360,
            }
          }
        />
      </ContentSection>
    </PageLayout>
  );
}
