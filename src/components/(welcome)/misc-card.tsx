import { ReactNode, useEffect, useRef } from 'react';

import { cn, kebab } from '../../utils';
import { Button } from '../ui';

type Props = {
  title: string | ReactNode;
  description: string | ReactNode;
  buttonName: string;
  action: () => void;
  color?: 'orange' | 'gray' | 'green';
  buttonHint?: ReactNode;
  observer?: IntersectionObserver;
};

export const AppMiscCard = (props: Props) => {
  const {
    title,
    description,
    buttonName,
    color,
    action,
    buttonHint,
    observer,
  } = props;

  const ref = useRef<HTMLDivElement>(null);

  // ! Observe this element
  useEffect(() => {
    if (ref.current) {
      observer?.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer?.unobserve(ref.current);
      }
    };
  }, [ref, observer]);

  return (
    <div ref={ref} className='px-5 sm:px-3 opacity-0'>
      {/* opacity-0 will be overridden by intersection observer */}
      <div
        className={cn('rounded-lg ring-2 text-gray-300', {
          'ring-dracula-orange bg-dracula-orange/10': color === 'orange',
          'ring-dracula-dark bg-dracula-dark/30': color === 'gray',
          'ring-dracula-green bg-dracula-green/10': color === 'green',
        })}>
        <div className='p-5 flex flex-col gap-y-5'>
          {typeof title === 'string' ? (
            <h2 className='text-lg font-bold'>{title}</h2>
          ) : (
            <>{title}</>
          )}

          {typeof description === 'string' ? (
            <p className='leading-6'>{description}</p>
          ) : (
            <>{description}</>
          )}

          <div className='flex flex-col sm:flex-row items-center gap-2'>
            <div className='w-full sm:w-auto'>
              <Button
                data-testid={kebab(buttonName)}
                onClick={action}
                className={cn(
                  'flex flex-row items-center justify-center gap-x-3 w-full sm:w-auto',
                  {
                    'bg-dracula-orange/50 hover:bg-dracula-orange hover:text-dracula-darker hover:drop-shadow-warning ring-dracula-orange':
                      color === 'orange',
                    'ring-dracula-blue hover:drop-shadow-primary':
                      color === 'gray',
                    'hover:drop-shadow-danger hover:bg-dracula-red':
                      color === 'green',
                  },
                )}>
                <span>{buttonName}</span>
              </Button>
            </div>
            {buttonHint}
          </div>
        </div>
      </div>
    </div>
  );
};
