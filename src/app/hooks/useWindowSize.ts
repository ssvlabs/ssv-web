import { useEffect, useState } from 'react';

export const WINDOW_SIZES = {
  XS: 'xs',
  SM: 'sm',
  LG: 'lg',
  MD: 'md',
};

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
    size: 'N/A',
  });

  useEffect(() => {
    function handleResize() {
      let size = WINDOW_SIZES.XS;
      if (window.innerWidth > 1200) {
        size = WINDOW_SIZES.LG;
      } else if (window.innerWidth > 992) {
        size = WINDOW_SIZES.MD;
      } else if (window.innerWidth > 576) {
        size = WINDOW_SIZES.SM;
      }

      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        size,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};
