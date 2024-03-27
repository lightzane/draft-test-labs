import { useEffect, useRef } from 'react';

import { cn } from '../../utils';
import { A } from '../ui';

/** Would prepend on the url */
const README = `https://github.com/lightzane/draft-test-labs/blob/main/README.md`;

type Props = {
  title: string;
  description: string;
  url: string;
  observer?: IntersectionObserver;
};

export const AppFeatureCard = (props: Props) => {
  const { title, description, url, observer } = props;

  const ref = useRef<HTMLDivElement>(null);

  // ! Observer this element
  useEffect(() => {
    if (observer && ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer?.unobserve(ref.current);
      }
    };
  }, [observer, ref]);

  return (
    <div
      ref={ref}
      className={cn(
        'opacity-0', // will be overriden by intersection observer
        'flex flex-col gap-y-3 rounded-lg p-5 shadow-lg',
        'border-t-[1px] border-b-[1px] border-t-gray-500 border-b-gray-900',
        'bg-gradient-to-br from-dracula-pink/20',
      )}>
      <h2
        className='text-lg sm:text-3xl font-bold sm:tracking-tighter'
        data-testid={title.toLowerCase()}>
        {title}
      </h2>
      <p className='leading-6 sm:text-lg'>{description}</p>
      <div className='flex flex-row group'>
        <A native _blank href={`${README}${url}`}>
          <span className='text-dracula-pink group-hover:text-dracula-cyan transition-all ease-in-out duration-300'>
            Read more
          </span>
        </A>
      </div>
    </div>
  );
};
