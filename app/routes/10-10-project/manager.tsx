import HTMLViewer from '~/components/common/HTMLViewer';
import PageLayout from '~/components/layout/PageLayout';
import { useLanguage } from '~/hooks/useLanguage';

export default function TenTenManagerPage() {
  const { t, localizedPath } = useLanguage();

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

  const htmlContent = `<h3>Professor Soonhoi Ha (Department Head)<br /></h3>
<p>Codesign And Parallel Processing Lab</p>
<p>Contact info</p>
<p>Office: 301 Building, Room 408</p>
<p>Phone: (02) 880-8382 Fax: (02) 886-7589</p>
<p>Email: sha@iris.snu.ac.kr</p>
<p>
  Website:&nbsp;<a rel="nofollow" href="http://peace.snu.ac.kr/sha/">http://peace.snu.ac.kr/sha/</a>
</p>
<p>Education Ph.D. in EECS, University of California, Berkeley, 1992</p>
<p>Introduction&nbsp;:<a rel="nofollow" href="${localizedPath(
    '/about/greetings',
  )}">${localizedPath('/about/greetings')}</a></p>
<h3>Curricular Vitae (CV)&nbsp;</h3>
<p>
  <a
    rel="nofollow"
    href="https://docs.google.com/document/d/1WmpKLWIv_xjwFv4VFOItJ4vuhfAPi-67JRCl6pszHoI/edit"
    >https://docs.google.com/document/d/1WmpKLWIv_xjwFv4VFOItJ4vuhfAPi-67JRCl6pszHoI/edit</a
  >
</p>
`;

  return (
    <PageLayout
      title={t('Manager')}
      titleSize="xl"
      breadcrumb={[
        { name: t('10-10 Project'), path: '/10-10-project' },
        { name: t('Manager'), path: '/10-10-project/manager' },
      ]}
      subNav={subNav}
    >
      <HTMLViewer html={htmlContent} />
    </PageLayout>
  );
}
