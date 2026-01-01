import type { Route } from '.react-router/types/app/routes/10-10-project/+types/participants';
import PageLayout from '~/components/layout/PageLayout';
import HTMLViewer from '~/components/ui/HTMLViewer';
import { useLanguage } from '~/hooks/useLanguage';
import { processHtmlForCsp } from '~/utils/csp';
import { getLocaleFromPathname } from '~/utils/string';

const META = {
  ko: {
    title: 'Participants (Professors)',
    description:
      '서울대학교 컴퓨터공학부 10-10 Project 참여 교수진을 소개합니다. 학술 우수팀, 산학 협력팀, AI팀, 인적 자원팀으로 구성되어 있습니다.',
  },
  en: {
    title: 'Participants (Professors)',
    description:
      'Faculty participants of the 10-10 Project at the Department of Computer Science and Engineering, Seoul National University.',
  },
};

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const localizedPath = locale === 'en' ? '/en' : '';

  return {
    htmlContent: processHtmlForCsp(
      buildHtmlContent(`${localizedPath}/people/faculty`),
    ),
  };
}

export default function TenTenParticipantsPage({
  loaderData,
}: Route.ComponentProps) {
  const { t, locale } = useLanguage();

  const subNav = {
    title: t('10-10 Project'),
    titlePath: '/10-10-project',
    items: [
      { name: t('Proposal'), path: '/10-10-project/proposal' },
      { name: t('Manager'), path: '/10-10-project/manager' },
      {
        name: t('Participants(Professors)'),
        path: '/10-10-project/participants',
      },
    ],
  };

  const htmlContent = loaderData.htmlContent;

  const meta = META[locale];

  return (
    <PageLayout
      title={t('Participants(Professors)')}
      titleSize="xl"
      subNav={subNav}
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
      <HTMLViewer html={htmlContent} />
    </PageLayout>
  );
}

const buildHtmlContent = (
  facultyPath: string,
) => `<h3><strong>Academic Excellence Team</strong><br /></h3>
<p>Team Leader: Prof. U Kang</p>
<p>Prof. Choong Gil Hur</p>
<p>Prof. Tae Hyun Kim</p>
<p>Prof. Myung-Soo Kim</p>
<p>Prof. Tae Kyoung Kwon</p>
<p>Prof. Heon Young Yeom</p>
<p><br /></p>
<h3>Industry Collaboration Team</h3>
<p>Team Leader: -Prof. Jin Soo Kim:</p>
<p>Prof. Hyeon Sang Eom:</p>
<p>Prof. Chong Kwon Kim</p>
<p>Prof. Hyoung Joo Kim</p>
<p>Prof. Ji Hong Kim</p>
<p>Prof. Chang Gun Lee</p>
<p>Prof. Jae Jin Lee</p>
<p>Prof. Yeong Kil Shin</p>
<p><br /></p>
<h3>AI Team</h3>
<p>Team Leader: Prof. Gun Hee Kim</p>
<p>Prof. Yang Hee Choi</p>
<p>Prof. Byung Gon Chun</p>
<p>Prof. Sun Kim</p>
<p>Prof. Sang Goo Lee</p>
<p>Prof. Byung-Ro Moon</p>
<p>Prof. Hyun Oh Song</p>
<p>Prof. Byung Tak Zhang</p>
<p>Prof. Sung Joo Yoo</p>
<p><br /></p>
<h3>Human Resources Team</h3>
<p>Team Leader: Prof. Jin Wook Seo</p>
<p>Prof. Bernhard Egger</p>
<p>Prof. Wha Sook Jeon</p>
<p>Prof. Jae Wook Lee</p>
<p>Prof. Je Hee Lee</p>
<p>Prof. Young Ki Lee</p>
<p>Prof. Bong Ki Moon</p>
<p>Prof. Kun Soo Park</p>
<p>Prof. Kwang Keun Yi</p>
<p>
  <a href="${facultyPath}">click here for detailed info of participants</a>
</p>`;
