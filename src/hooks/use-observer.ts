import { useEffect, useState } from 'react';

type Props = {
  threshold?: number;
  intersecting: (entry: IntersectionObserverEntry) => void;
  root?: Element | Document | null;
  rootMargin?: string;
};

/** Uses `InteserctionObserver` */
export const useObserver = (props: Readonly<Props>) => {
  const { threshold, intersecting, root, rootMargin } = props;

  const [observer, setObserver] = useState<IntersectionObserver>();

  // ! Observer listener
  useEffect(() => {
    const io = initObserver();

    setObserver(io);

    return () => {
      io.disconnect();
    };
  }, []);

  const initObserver = () => {
    const options: IntersectionObserverInit = {
      threshold: threshold ?? 1, // only when 100% of the element is visible
      root,
      rootMargin,
    };

    const io = new IntersectionObserver(callback, options);

    function callback(entries: IntersectionObserverEntry[]) {
      entries.forEach(intersection);
    }

    function intersection(entry: IntersectionObserverEntry) {
      if (entry.isIntersecting) {
        intersecting(entry);
        io.unobserve(entry.target);
      }
    }

    return io;
  };

  const disconnect = () => {
    observer?.disconnect();
  };

  return { observer, disconnect };
};
