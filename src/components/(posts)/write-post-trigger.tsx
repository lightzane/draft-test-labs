import { useEffect, useState } from 'react';

import { Button } from '../ui';
import { useScrollListener } from '../../hooks';
import { useUserStore } from '../../stores';

type Props = {
  onClick?: () => void;
};

export default function AppWritePostTrigger(props: Readonly<Props>) {
  const [show, setShow] = useState(true);

  const { user } = useUserStore();

  useScrollListener({
    onScrollUp() {
      setShow(true);
    },
    onScrollDown(scrollY) {
      if (scrollY >= 70) {
        setShow(false);
      }
    },
  });

  // ! Display Write a Post button
  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 500);
  }, []);

  return (
    <div className='pointer-events-none relative z-10'>
      {/* Floating Button */}
      <div className='fixed inset-0 flex items-end justify-center pb-10'>
        {show && user && (
          <div className='flex items-center gap-5 w-full max-w-xs animate-enter'>
            {/* extra div with bg-dracula-cyan prevents Button to be transparent when being hovered */}
            <div className='w-full bg-dracula-cyan rounded-lg'>
              <Button
                data-testid='write-a-post'
                rare
                className='pointer-events-auto shadow-lg w-full'
                onClick={() => props.onClick?.()}>
                Write a post
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
