'use client';

import SectionHeader from '~/components/common/SectionHeader';
import { useLanguage } from '~/hooks/useLanguage';
import useResponsive from '~/hooks/useResponsive';
import type { MainNews } from '~/types/api/v2';
import NewsCarousel from './NewsCarousel';
import NewsCarouselMobile from './NewsCarouselMobile';

export default function NewsSection({ mainNews }: { mainNews: MainNews[] }) {
  const isMobile = useResponsive();
  const { t, localizedPath } = useLanguage();

  return (
    <div className="relative flex flex-col gap-6.5 overflow-hidden bg-neutral-100 pb-12 pl-5 pt-8 sm:flex-row sm:gap-[60px] sm:py-10 sm:pl-[60px] sm:pr-[150px] sm:pt-[72px]">
      <SectionHeader
        title={t('소식')}
        action={{
          label: t('더보기'),
          to: localizedPath('/community/news'),
          icon: 'arrow',
        }}
        actionVisibility="desktop"
      />
      {isMobile ? (
        <NewsCarouselMobile news={mainNews} />
      ) : (
        <NewsCarousel news={mainNews} />
      )}
    </div>
  );
}
