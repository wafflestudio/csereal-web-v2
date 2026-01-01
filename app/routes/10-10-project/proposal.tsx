import type { Route } from '.react-router/types/app/routes/10-10-project/+types/proposal';
import PageLayout from '~/components/layout/PageLayout';
import HTMLViewer from '~/components/ui/HTMLViewer';
import { useLanguage } from '~/hooks/useLanguage';
import { processHtmlForCsp } from '~/utils/csp';
import { getLocaleFromPathname } from '~/utils/string';

const META = {
  ko: {
    title: 'Proposal',
    description:
      '서울대학교 컴퓨터공학부 10-10 Project 제안서입니다. 향후 5년 내 세계적 수준의 컴퓨터공학부로 도약하기 위한 전략과 실행 계획을 담고 있습니다.',
  },
  en: {
    title: 'Proposal',
    description:
      '10-10 Project proposal for the Department of Computer Science and Engineering, Seoul National University. Outlines strategies to become a world-leading department.',
  },
};

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const prefix = locale === 'en' ? '/en' : '';

  return {
    htmlContent: processHtmlForCsp(
      buildHtmlContent(
        `${prefix}/10-10-project/manager`,
        `${prefix}/10-10-project/participants`,
      ),
    ),
  };
}

export default function TenTenProposalPage({
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
      title={t('Proposal')}
      titleSize="xl"
      subNav={subNav}
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
      <HTMLViewer html={htmlContent} />
    </PageLayout>
  );
}

const buildHtmlContent = (managerPath: string, participantsPath: string) =>
  `<h2>1. Executive Summary</h2>
<hr class="__se__solid" />
<p>
  The goal of this project is to propel the Department of Computer Science and Engineering (CSE) at
  Seoul National University into a leading department in computer science and engineering in the
  world within the next five years. To reach this ambitious goal, the department must not only offer
  a world-class research environment that facilitates and stimulates excellent achievements, but it
  must also be recognized as such. To address the first part, we will strengthen our research
  excellence with a particular focus on our core competencies: artificial intelligence (AI) and
  computer systems (Strategy 1, S1). At the same time, we improve the recognition of our department
  through an active collaboration with renowned experts and employment of aspiring excellent young
  researchers (S2). We first analyze the strengths, weaknesses, opportunities, and threats of our
  department as follows.
</p>
<ul>
  <li>
    Strengths: As the most prestigious university in Korea, our department attracts the most
    competitive students and industry collaboration with world-renowned companies such as Samsung,
    SK Hynix, Hyundai, LG, and many more.
  </li>
  <li>
    Weaknesses: Compared with other top universities, the teaching load of our faculty is relatively
    high. We also have significant room for improvement in terms of international collaboration.
  </li>
  <li>
    Opportunities: Computer systems, machine learning and artificial intelligence (AI) have long
    been core competencies of our department. As such, we are well-positioned to take advantage of
    the recent raise in importance of these topics in terms of government and industry support and
    international recognition.
  </li>
  <li>
    Threats: Important resources such as space and faculty members required for educating the
    rapidly growing body of students could fall short of our needs and expectations.
  </li>
</ul>
<p>
  To reinforce our strengths and take advantage of opportunities while at the same time eliminate
  weaknesses and overcome potential threats, we will drastically improve the research environment
  and significantly strengthen collaboration and competency of our diverse human resources. We
  propose the following action plans to foster the two strategies identified above of (S1)
  strengthening our department's research excellence and (S2) increasing the visibility and
  international recognition of our department as follows:
</p>
<p>
  (P1) Reduce the teaching load to a level similar to that of top institutions (fosters S1) and
  improve support for international activities and recognition of our faculty (S2).
</p>
<p>(P2) Advance industry collaboration by establishing a center for industry collaboration (S1).</p>
<p>
  (P3) Invite internationally renowned researchers for visits, talks, and collaborations and
  organize an annual international AI summer camp to foster networking and personal interaction
  (S2).
</p>
<p>
  (P4) Recruit outstanding new faculty members and postdocs by actively approaching potential
  candidates and inviting them to a Rising Stars workshop (S1, S2).
</p>
<p>
  (P5) Attract high quality graduate students from Asian countries and other regions through active
  promotion and advertisements of our department (S1, S2). We assess the effectiveness of this
  project by comparing our academic excellence to the top ten research universities in computer
  science and engineering. In addition to global university rankings, we also consider metrics such
  as citations, h-index, and the Field-Weighted Citation Impact (FWCI).<br />
</p>
<p><br /></p>
<h2>PART B. Project Description</h2>
<hr class="__se__solid" />
<p>
  <a
    href="https://docs.google.com/document/d/1rsXCl24JP1X7G4H7FCU-0cz4GaJ2JSiiCsRZjQD804U/edit"
    rel="nofollow"
    >https://docs.google.com/document/d/1rsXCl24JP1X7G4H7FCU-0cz4GaJ2JSiiCsRZjQD804U/edit</a
  >
</p>
<p><br /></p>
<h2>PART C. Biographical Sketch</h2>
<hr class="__se__solid" />
<p>
  <a
    href="https://docs.google.com/document/d/17ixUuD54FdC03i3fddhiKiM4bz1zw-xU_XuiBwgqMkU/edit"
    rel="nofollow"
    >https://docs.google.com/document/d/17ixUuD54FdC03i3fddhiKiM4bz1zw-xU_XuiBwgqMkU/edit</a
  >
</p>
<p><br /></p>
<h2>PART D. Budget Plan</h2>
<hr class="__se__solid" />
<p>
  <a
    href="https://docs.google.com/document/d/10KY1j7ogVqCD2xIh8a3P3ggh02sUuzdHl9o5YR22kWQ/edit"
    rel="nofollow"
    >https://docs.google.com/document/d/10KY1j7ogVqCD2xIh8a3P3ggh02sUuzdHl9o5YR22kWQ/edit</a
  >
</p>
<p>
  <a
    href="https://docs.google.com/document/d/10KY1j7ogVqCD2xIh8a3P3ggh02sUuzdHl9o5YR22kWQ/edit"
    rel="nofollow"
    ><br
  /></a>
</p>
<h2>References</h2>

<hr class="__se__solid" />
<p>
<a href="${managerPath}" rel="nofollow">professor-soonhoi-ha</a>
</p>

<p>
  <a
    href="https://docs.google.com/document/d/1WmpKLWIv_xjwFv4VFOItJ4vuhfAPi-67JRCl6pszHoI"
    rel="nofollow"
    >Curricula vitae</a
  >
</p>

<p><a href="${participantsPath}" rel="nofollow">Team Organization and Participants</a></p>
`;
