import type { Route } from '.react-router/types/app/routes/reservations/+types/privacy-policy';
import PageLayout from '~/components/layout/PageLayout';
import HTMLViewer from '~/components/ui/HTMLViewer';
import { useLanguage } from '~/hooks/useLanguage';
import { processHtmlForCsp } from '~/utils/csp';

const META = {
  ko: {
    title: '개인정보처리방침',
    description:
      '서울대학교 컴퓨터공학부 시설 예약 시스템의 개인정보처리방침입니다. 개인정보 수집 항목, 이용 목적, 보유 기간 등을 안내합니다.',
  },
  en: {
    title: 'Privacy Policy',
    description:
      'Privacy policy for the facility reservation system at the Department of Computer Science and Engineering, Seoul National University.',
  },
};

export async function loader() {
  const HTML_CONTENT = `<p><span style="background-color: transparent">서울대학교에서는『개인정보보호법』등 관련 법규에 의거하여 문화시설 신청과 관련된 정보를 문화시설 예약 및 사용을 위해 개인정보 수집 동의서를 받고 있습니다.&nbsp;개인정보 수집·이용 동의 사항 내용 외의 다른 목적으로 활용하지 않음을 알려드립니다.</span><br></p><p style="text-align: left">□&nbsp;개인정보 수집·이용에 관한 사항(필수)</p><p style="text-align: left">ㅇ개인정보의 수집 항목,&nbsp;방법,&nbsp;이용 목적,&nbsp;보유 기간</p><table><tbody><tr><td><p style="text-align: center"><span style="font-size: 15px">수집 항목</span></p></td><td><p style="text-align: center"><span style="font-size: 15px">수집 방법</span></p></td><td><p style="text-align: center"><span style="font-size: 15px">수집</span><span style="font-size: 15px">·</span><span style="font-size: 15px">이용</span><span style="font-size: 15px">·</span><span style="font-size: 15px">제공 목적</span></p></td><td><p style="text-align: center"><span style="font-size: 15px">보유</span><span style="font-size: 15px">·</span><span style="font-size: 15px">이용기간</span></p></td></tr><tr><td><p style="text-align: center"><span style="font-size: 17px">이름</span><span style="font-size: 17px">,&nbsp;</span><span style="font-size: 17px">소속</span><span style="font-size: 17px">,&nbsp;</span><span style="font-size: 17px">학번</span><span style="font-size: 17px">,&nbsp;</span><span style="font-size: 17px">연락처</span><span style="font-size: 17px">, MySNU&nbsp;</span><span style="font-size: 17px">포털 아이디</span></p></td><td><p style="text-align: center"><span style="font-size: 15px">신청 서류</span></p></td><td><p style="text-align: center"><span style="font-size: 15px">시설 예약 및 사용</span></p></td><td><p style="text-align: center"><span style="font-size: 19px">신청일로부터&nbsp;</span><span style="font-size: 19px">3</span><span style="font-size: 19px">년 까지</span></p></td></tr></tbody></table><p style="text-align: left">※개인정보 수집·이용에 대한 동의를 거부할 권리가 있으나,&nbsp;동의를 거부할 경우 시설 예약이 불가합니다.</p>`;
  return processHtmlForCsp(HTML_CONTENT);
}

export default function ReservationPrivacyPolicyPage({
  loaderData,
}: Route.ComponentProps) {
  const { t, locale } = useLanguage({
    개인정보처리방침: 'Privacy Policy',
  });

  const meta = META[locale];

  return (
    <PageLayout
      title={t('개인정보처리방침')}
      titleSize="xl"
      titleMargin="mb-9"
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
      <HTMLViewer html={loaderData} />
    </PageLayout>
  );
}
