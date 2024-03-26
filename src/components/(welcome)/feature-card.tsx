import { useEffect, useRef } from 'react';

import { cn } from '../../utils';

type Props = {
  title: string;
  description: string;
  observer?: IntersectionObserver;
};

export const AppFeatureCard = (props: Props) => {
  const { title, description, observer } = props;

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
    </div>
  );
};
