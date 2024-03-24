import { LucideFlaskConical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { PageRoute } from '../../constants';
import { Button } from '../ui';

export const AppHero = () => {
  const navigate = useNavigate();

  return (
    <div
      className='flex flex-col gap-y-5 min-h-[70vh]' // ! min-h-[100vh] is required for "flex" (adjust accordingly)
      style={{ transform: 'translateZ(-10px) scale(2)' }} // ! the parent should have transform=preserve-3d and min-h-[100vh]
    >
      <div className='pt-10 sm:pt-20 animate-enter'>
        <div className='flex flex-col items-center gap-5'>
          <LucideFlaskConical
            className='drop-shadow-primary text-dracula-pink'
            size={100}
            strokeWidth={1.5}
          />
          <div className='relative text-6xl font-extrabold'>
            <h1 className='absolute blur-lg bg-clip-text text-transparent bg-gradient-to-r from-dracula-purple to-dracula-pink'>
              Test Labs
            </h1>
            <h1 className='bg-clip-text text-transparent bg-gradient-to-r from-dracula-purple to-dracula-pink'>
              Test Labs
            </h1>
          </div>
          <div className='text-lg text-center w-52 sm:w-auto'>
            Your playground on automation testing tools
          </div>
          <div>
            <Button
              onClick={() => navigate(PageRoute.REGISTER())}
              rare
              className='text-lg'>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
