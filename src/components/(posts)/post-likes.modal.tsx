import { useEffect, useState } from 'react';

import { PageRoute } from '../../constants';
import { useModal } from '../../hooks';
import { User } from '../../models';
import { usePostStore, useUserStore } from '../../stores';
import { cn } from '../../utils';
import { A } from '../ui';
import AppUserAvatar from '../user-avatar';

export default function AppPostLikesModal() {
  const { postLikes, setPostLikes } = usePostStore();
  const { users } = useUserStore();

  const { register, showModal, setShowModal } = useModal({
    onHide: () => setPostLikes([]),
  });

  const [likers, setLikers] = useState<User[]>([]);

  // ! Load users info
  useEffect(() => {
    if (postLikes.length) {
      const list: User[] = [];
      postLikes.forEach((id) => {
        const liker = users.find((u) => u.id === id);
        liker && list.push(liker);
      });
      setLikers(list);
      setShowModal(true);
    } else {
      setLikers([]);
      setShowModal(false);
    }
  }, [postLikes]);

  return (
    <div className='absolute inset-0 pointer-events-none z-10'>
      <div
        data-testid='post-likes-modal-overlay'
        {...register()}
        className={cn(
          'fixed inset-0 bg-dracula-light/20 backdrop-blur-sm opacity-0 cursor-pointer',
          'flex items-center justify-center',
          'transition-opacity ease-in-out duration-300',
          { 'opacity-100 pointer-events-auto': showModal },
        )}></div>

      <div className='fixed inset-0 flex items-center justify-center'>
        <div
          className={cn(
            'rounded-lg shadow-lg p-5 bg-dracula-dark cursor-default min-h-52 w-full max-w-md',
            'transition-all ease-in-out duration-300',
            'max-h-[70vh] overflow-y-auto',
            {
              'opacity-100 scale-100 pointer-events-auto': showModal,
              'opacity-0 scale-50': !showModal,
            },
          )}>
          <ul className='flex flex-col pointer-events-auto'>
            {likers.map((liker) => (
              <li key={liker.id}>
                <A
                  underline={false}
                  href={PageRoute.PROFILE(liker.id)}
                  className='flex items-center gap-x-5 w-full'
                  onClick={() => setShowModal(false)}>
                  <div className='flex items-center gap-x-3 p-2 rounded-xl hover:bg-white/10 w-full transition-colors ease-in-out duration-300'>
                    <AppUserAvatar user={liker} />
                    <span>{liker.username}</span>
                  </div>
                </A>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
