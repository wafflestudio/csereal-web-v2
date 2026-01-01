import { useCallback, useEffect, useState } from 'react';
import type { MainNews } from '~/types/api/v2';
import { AUTO_SCROLL_MS } from './constants';
import { useCarouselLayout } from './useCarouselLayout';

export default function useCarousel(news: MainNews[]) {
  const [page, _setPage] = useState(0);
  const [intervalID, setIntervalID] = useState<number | null>(null);
  const { cardCnt, widthREM } = useCarouselLayout();
  const pageCnt = Math.ceil(news.length / cardCnt);
  const offsetREM = widthREM * page;

  // 반응형으로 페이지 수 바뀌었을 때 처리
  useEffect(() => {
    _setPage((page) => {
      return pageCnt - 1 < page ? pageCnt - 1 : page;
    });
  }, [pageCnt]);

  const isScroll = intervalID !== null;

  const startScroll = useCallback(() => {
    setIntervalID(
      window.setInterval(() => {
        _setPage((x) => (x + 1) % pageCnt);
      }, AUTO_SCROLL_MS),
    );
  }, [pageCnt]);

  const stopScroll = useCallback(() => {
    setIntervalID((x) => {
      if (x) clearInterval(x);
      return null;
    });
  }, []);

  const setPage = useCallback(
    (page: number) => {
      stopScroll();
      _setPage(page);
      if (isScroll) startScroll();
    },
    [isScroll, startScroll, stopScroll],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: 투두
  useEffect(() => {
    startScroll();
    return stopScroll;
  }, [pageCnt, startScroll, stopScroll]);

  return {
    offsetREM,
    widthREM,
    cardCnt,
    page,
    setPage,
    pageCnt,
    isScroll,
    startScroll,
    stopScroll,
  };
}
