import HTMLViewer from '~/components/common/HTMLViewer';
import PageLayout from '~/components/layout/PageLayout';
import { useLanguage } from '~/hooks/useLanguage';

export default function TenTenParticipantsPage() {
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

  const htmlContent = `<h3><strong>Academic Excellence Team</strong><br /></h3>
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
  <a href="${localizedPath(
    '/people/faculty',
  )}">click here for detailed info of participants</a>
</p>`;

  return (
    <PageLayout
      title={t('Participants(Professors)')}
      titleSize="xl"
      breadcrumb={[
        { name: t('10-10 Project'), path: '/10-10-project' },
        {
          name: t('Participants(Professors)'),
          path: '/10-10-project/participants',
        },
      ]}
      subNav={subNav}
    >
      <HTMLViewer html={htmlContent} />
    </PageLayout>
  );
}
