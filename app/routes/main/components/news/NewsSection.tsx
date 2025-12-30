import { Link } from 'react-router';
import SmallRightArrowIcon from '~/components/ui/assets/small_right_arrow.svg?react';
import { useLanguage } from '~/hooks/useLanguage';
import useIsMobile from '~/hooks/useResponsive';
import type { MainNews } from '~/types/api/v2';
import NewsCarousel from './NewsCarousel';
import NewsCarouselMobile from './NewsCarouselMobile';

export default function NewsSection({ mainNews }: { mainNews: MainNews[] }) {
  const isMobile = useIsMobile();
  const { t, localizedPath } = useLanguage();

  return (
    <div className="relative flex flex-col gap-6.5 overflow-hidden bg-neutral-100 pb-12 pl-5 pt-8 sm:flex-row sm:gap-[60px] sm:py-10 sm:pl-[60px] sm:pr-[150px] sm:pt-[72px]">
      <div className="flex flex-col gap-2">
        <h3 className="text-[1.25rem] font-semibold text-neutral-950 sm:text-[1.75rem] sm:font-medium">
          {t('새 소식')}
        </h3>
        <Link
          className="hidden items-center gap-1 text-base font-normal text-[#E65615] sm:flex"
          to={localizedPath('/community/news')}
        >
          {t('더보기')} <SmallRightArrowIcon />
        </Link>
      </div>
      {isMobile ? (
        <NewsCarouselMobile news={mainNews} />
      ) : (
        <NewsCarousel news={mainNews} />
      )}
    </div>
  );
}
