import { useEffect } from 'react';

type ScrollListenerConfig = {
  onScrollUp: (scrollY: number) => void;
  onScrollDown: (scrollY: number) => void;
};

export const useScrollListener = (config: ScrollListenerConfig) => {
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const scrollListener = () => {
      // scrolling UP
      if (lastScrollY > window.scrollY) {
        config.onScrollUp(window.scrollY);
      }

      // scrolling down
      else {
        config.onScrollDown(window.scrollY);
      }

      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, []);
};
