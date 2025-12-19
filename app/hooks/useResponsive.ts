import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 640; // sm breakpoint

/**
 * 모바일 여부를 반환 (640px 미만)
 */
export default function useResponsive() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
