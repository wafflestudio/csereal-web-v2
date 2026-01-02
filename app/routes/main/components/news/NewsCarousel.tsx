import type { ButtonHTMLAttributes } from 'react';
import { useEffect, useRef } from 'react';
import type { MainNews } from '~/types/api/v2';
import PauseIcon from './assets/pause.svg?react';
import PlayIcon from './assets/play.svg?react';
import { CARD_GAP_TAILWIND } from './constants';
import NewsCard from './NewsCard';
import useCarousel from './useCarousel';

const widthMap = {
  3: 'w-[45.35rem]',
  4: 'w-[61.15rem]',
} as const;

export default function NewsCarousel({ news }: { news: MainNews[] }) {
  const {
    offsetREM,
    cardCnt,
    pageCnt,
    setPage,
    page,
    isScroll,
    startScroll,
    stopScroll,
  } = useCarousel(news);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `translateX(-${offsetREM}rem)`;
  }, [offsetREM]);

  return (
    <div className="flex flex-col items-center">
      <div
        className={`mx-auto overflow-hidden pb-10 ${widthMap[cardCnt as 3 | 4]}`}
      >
        <div
          ref={trackRef}
          className={`flex ${CARD_GAP_TAILWIND} transition-transform duration-700 ease-[cubic-bezier(0.42,0,0.58,1)]`}
        >
          {news.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
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
      className={`flex h-6 items-center justify-center duration-700 ${
        isHighlight ? 'w-14' : 'w-6'
      }`}
      {...props}
    >
      <div
        className={`mx-2 h-2 w-full rounded-full ${
          isHighlight ? 'bg-[#E65615]' : 'bg-neutral-300'
        }`}
      />
    </button>
  );
};
