import type { ButtonHTMLAttributes } from 'react';
import { useEffect, useRef } from 'react';
import type { MainNews } from '~/types/api/v2';
import { animateScrollLeft } from './animateScrollTo';
import PauseIcon from './assets/pause.svg?react';
import PlayIcon from './assets/play.svg?react';
import { CARD_GAP_REM, CARD_GAP_TAILWIND } from './constants';
import NewsCard from './NewsCard';
import useCarousel from './useCarousel';
import { useCarouselLayout } from './useCarouselLayout';

export default function NewsCarousel({ news }: { news: MainNews[] }) {
  const {
    offsetREM,
    pageCnt,
    setPage,
    page,
    isScroll,
    startScroll,
    stopScroll,
  } = useCarousel(news);
  const { widthREM } = useCarouselLayout();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current === null) return;
    return animateScrollLeft(containerRef.current, offsetREM * 16);
  }, [offsetREM]);

  return (
    <div className="flex flex-col items-center">
      <div
        className={`no-scrollbar mx-auto flex overflow-x-hidden pb-10 ${CARD_GAP_TAILWIND}`}
        ref={containerRef}
        style={{ width: `${widthREM - CARD_GAP_REM}rem` }}
      >
        {news.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
      <PageIndicator
        page={page}
        pageCnt={pageCnt}
        setPage={setPage}
        isScroll={isScroll}
        startScroll={startScroll}
        stopScroll={stopScroll}
      />
    </div>
  );
}

const PageIndicator = ({
  page,
  pageCnt,
  setPage,
  isScroll,
  startScroll,
  stopScroll,
}: {
  page: number;
  pageCnt: number;
  setPage: (page: number) => void;
  isScroll: boolean;
  startScroll: () => void;
  stopScroll: () => void;
}) => {
  return (
    <div className="relative flex">
      {[...Array(pageCnt).keys()].map((idx) => (
        <PageIndicatorDot
          key={idx}
          aria-label={`${idx + 1}번째 페이지로 이동`}
          isHighlight={page === idx}
          onClick={() => setPage(idx)}
        />
      ))}
      <button
        type="button"
        onClick={isScroll ? stopScroll : startScroll}
        aria-label={isScroll ? '자동 스크롤 중지' : '자동 스크롤 시작'}
      >
        {isScroll ? <PauseIcon /> : <PlayIcon />}
      </button>
    </div>
  );
};

const PageIndicatorDot = ({
  isHighlight,
  ...props
}: {
  isHighlight: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className="flex h-6 items-center justify-center duration-700 "
      style={{ width: isHighlight ? '3.5rem' : '1.5rem' }}
      {...props}
    >
      <div
        className="mx-2 h-2 w-full rounded-full"
        style={{ backgroundColor: isHighlight ? '#E65615' : '#D4D4D4' }}
      />
    </button>
  );
};
