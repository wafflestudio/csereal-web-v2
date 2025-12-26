import { useEffect, useState } from 'react';
import { CARD_GAP_REM, CARD_WIDTH_REM } from './constants';

export const useCarouselLayout = () => {
  const [cardCnt, setCardCnt] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      const wide = window.innerWidth <= 1380;
      setCardCnt(wide ? 3 : 4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const widthREM = (CARD_WIDTH_REM + CARD_GAP_REM) * cardCnt - 0.05;

  return { cardCnt, widthREM };
};
