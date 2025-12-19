import { Link } from 'react-router';
import {
  getLinkGroups,
  type LinkGroupProps,
} from '~/components/layout/Footer/linkGroups';
import { useLanguage } from '~/hooks/useLanguage';
import useFooterDesignMode from '../../../hooks/useFooterDesignMode';
import SnuEngineeringIcon from './assets/SNU_Engineering.svg?react';
import SnuLogoWithText from './assets/SNU_Logo_with_Text.svg?react';
import footerTranslations from './translations.json';

export default function Footer() {
  const mode = useFooterDesignMode();
  const { locale } = useLanguage(footerTranslations);
  const topBg =
    mode === 'light' ? 'bg-neutral-50' : 'bg-[#262728] sm:bg-neutral-900';
  const bottomBg = mode === 'light' ? 'bg-neutral-100' : 'bg-[rgb(30,30,30)]';
  const borderTop =
    mode === 'light' ? 'border-neutral-100' : 'border-neutral-800';

  return (
    <footer className={`border-t-2 ${borderTop}`}>
      <div
        className={`${topBg} flex flex-wrap gap-y-8 px-6 py-9 sm:px-15 sm:py-10`}
      >
        {getLinkGroups(locale).map((group) => (
          <LinkGroup key={group.groupName} {...group} />
        ))}
      </div>
      <div
        className={`${bottomBg} flex flex-col justify-between px-5 py-[30px] sm:flex-row sm:items-center sm:px-15 sm:py-8`}
      >
        <FooterBottomLeft />
        <FooterBottomRight />
      </div>
    </footer>
  );
}

function LinkGroup({ groupName, links, width }: LinkGroupProps) {
  const mode = useFooterDesignMode();
  const { t } = useLanguage(footerTranslations);

  const titleColor =
    mode === 'light' ? 'text-neutral-600' : 'text-neutral-200 sm:text-white';
  const itemColor =
    mode === 'light'
      ? 'text-neutral-500'
      : 'text-neutral-300 sm:text-neutral-500';

  return (
    <section className={width}>
      <h3
        className={`${titleColor} mb-[.625rem] text-sm font-medium tracking-[0.025rem] sm:text-[0.9375rem]`}
      >
        {t(groupName)}
      </h3>

      <ul
        className={`${itemColor} flex flex-col gap-2.5 text-sm font-light sm:font-normal`}
      >
        {links.map((link, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: 고정 값임
          <li key={i}>
            <Link to={link.href} className="whitespace-nowrap">
              {t(link.title)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FooterBottomLeft() {
  const { t } = useLanguage(footerTranslations);

  return (
    <div className="text-xs text-neutral-500 sm:text-sm">
      <div className="mb-1 flex gap-[1ch] [&>a]:font-bold ">
        <a
          href="https://www.snu.ac.kr/personal_information"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('개인정보처리방침')}
        </a>
        <span>|</span>
        <Link to="/about/contact">{t('학부 연락처')}</Link>
        <span>|</span>
        <Link to="/about/directions">{t('찾아오시는 길')}</Link>
      </div>

      <address className="mb-[1.37rem] not-italic">
        {t(
          '08826 서울특별시 관악구 관악로 1 서울대학교 공과대학 컴퓨터공학부 행정실(301동 316호)',
        )}
      </address>

      <p className="leading-4.5">
        Powered by{' '}
        <span className="cursor-pointer hover:underline">CSEREAL</span>
        <br />
        <span className="whitespace-nowrap">© Department of CSE, SNU.</span>
        <span className="whitespace-nowrap"> All Rights Reserved.</span>
      </p>
    </div>
  );
}

function FooterBottomRight() {
  return (
    <div className="mt-7 flex flex-wrap gap-7 sm:mt-0 sm:flex-nowrap sm:items-center">
      <a
        href="http://eng.snu.ac.kr/"
        aria-label="서울대 공과대학 홈페이지로 이동"
        target="_blank"
        rel="noopener noreferrer"
      >
        <SnuEngineeringIcon />
      </a>
      <a
        href="https://www.snu.ac.kr/snunow/pr/videos"
        aria-label="서울대 홈페이지로 이동"
        target="_blank"
        rel="noopener noreferrer"
      >
        <SnuLogoWithText />
      </a>
    </div>
  );
}
