'use client';

import { Link } from 'react-router';
import { useLanguage } from '~/hooks/useLanguage';
import useResponsive from '~/hooks/useResponsive';
import type { MainNews } from '~/types/api/v2';
import NewsCarousel from './NewsCarousel';
import NewsCarouselMobile from './NewsCarouselMobile';

export default function NewsSection({ mainNews }: { mainNews: MainNews[] }) {
  const isMobile = useResponsive();

  return (
    <div className="relative flex flex-col gap-6.5 overflow-hidden bg-neutral-100 pb-12 pl-5 pt-8 sm:flex-row sm:gap-[60px] sm:py-10 sm:pl-[60px] sm:pr-[150px] sm:pt-[72px]">
      <Header />
      {isMobile ? (
        <NewsCarouselMobile news={mainNews} />
      ) : (
        <NewsCarousel news={mainNews} />
      )}
    </div>
  );
}

function Header() {
  const { t, localizedPath } = useLanguage();

  return (
    <div className="flex flex-col gap-2">
      <h3 className="whitespace-nowrap text-[1.25rem] font-semibold text-neutral-950 sm:text-[1.75rem] sm:font-medium">
        {t('소식')}
      </h3>
      <Link
        className="hidden items-center gap-1 text-base font-normal text-[#E65615] sm:flex"
        to={localizedPath('/community/news')}
      >
        {t('더보기')} <SmallRightArrow />
      </Link>
    </div>
  );
}

const SmallRightArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
  >
    <path
      d="M9.003 3.60039L14.3984 8.99583M14.3984 8.99583L9.003 14.4004M14.3984 8.99583L3.59844 8.99583"
      stroke="#E65615"
      strokeWidth="1.3"
    />
  </svg>
);
