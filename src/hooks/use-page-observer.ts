import { useEffect, useState } from 'react';
import { useObserver } from '.';

type PageObserverConfig = {
  /** Triggers when the item started its entry on the view */
  intersecting: (entry: IntersectionObserverEntry) => void;
  /** @example threshold: 0.2, // only when 20% of the element is visible */
  threshold?: number;
  /** The root element where the observer will base its intersection threshold. */
  root?: Element | Document | null;
  /** @default 5 */
  pageSize?: number;
  /** The initial page to view @default 0 */
  initial?: number;
};

type ListType<T> = T & { id: string };

/** Use this when you have an infinite number of items */
export const usePageObserver = <T>(
  list: ListType<T>[],
  config: PageObserverConfig,
) => {
  const { initial = 0, pageSize = 5, threshold = 0.2, root } = config;

  const [view, setView] = useState<ListType<T>[]>([]); // The chunks to display
  const [pageIndex, setPageIndex] = useState<number>(initial);
  const [seen, setSeen] = useState(0); // used with observer, to push additional posts when all currently displayed posts are seen

  const { observer, disconnect } = useObserver({
    root,
    threshold,
    intersecting(entry) {
      config.intersecting(entry);
      setSeen((count) => ++count);
    },
  });

  /** Prevent duplicates */
  const getDistinctItems = (prev: ListType<T>[], index: number) => {
    return list
      .slice(index, index + pageSize)
      .filter((post) => !prev.find((p) => p.id === post.id));
  };

  // ! Load initial post
  useEffect(() => {
    if (pageIndex <= list.length) {
      setView(
        (prev) => prev.concat(getDistinctItems(prev, pageIndex)),
        // ? something weird is happening during development
        // ? when you click on save, it seems to be not resetting the state
        // ? so it may have duplicate items
        // ? But this is may have been resolved by the `setDistinctItems()`
      );
    }

    // Won't be needing the observer anymore once the user sees everything
    if (pageIndex + pageSize >= list.length) {
      disconnect();
    }
  }, [pageIndex, pageSize, list.length]);

  // ! More posts
  useEffect(() => {
    // when last seen is the last display
    if (seen === view.length) {
      setPageIndex(seen); // this will trigger the effect of loading the posts to display (see above useEffect() initial post)
    }
  }, [seen, view.length]);

  // ! Clean up
  useEffect(() => {
    return () => {
      observer?.disconnect();
    };
  }, []);

  return {
    view,
    setView,
    observer,
  };
};
