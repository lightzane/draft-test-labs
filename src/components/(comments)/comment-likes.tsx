import { LucideChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

import { PageRoute, UNKNOWN_USER } from '../../constants';
import { Post, User } from '../../models';
import { useUserStore } from '../../stores';
import { cn } from '../../utils';
import { A, ButtonIcon } from '../ui';
import AppUserAvatar from '../user-avatar';

type Props = {
  commentId: string;
  post: Post;
  show: boolean;
  onCloseLikes: () => void;
  onCloseRequest: () => void; // close the entire modal of comments
};

export default function AppCommentLikes(props: Readonly<Props>) {
  const { show, post, commentId } = props;
  const { users } = useUserStore();
  const [likers, setLikers] = useState<User[]>([]);

  useEffect(() => {
    if (commentId) {
      const comment = post.comments.find((c) => c.id === commentId);

      if (comment) {
        const list = comment.likes.map(
          (id) => users.find((u) => u.id === id) || UNKNOWN_USER,
        );
        setLikers(list);
      }
    }

    return () => {
      setLikers([]);
    };
  }, [commentId, post, users]);

  return (
    <div className='relative z-10 pointer-events-none'>
      <div className='fixed inset-0'>
        <div
          className={cn(
            'bg-dracula-darker pointer-events-auto h-full',
            'transition-all ease-in-out duration-500',
            {
              'translate-x-full pointer-events-none': !show,
              'translate-x-0': show,
            },
          )}>
          <div className='border-b-[1px] border-b-dracula-pink'>
            <div className='relative px-4 flex flex-row items-center justify-center py-3'>
              <h3 className={cn('text-center font-semibold text-sm')}>
                <span>Likes</span>
              </h3>
              <div className='absolute flex items-center justify-start inset-x-0'>
                <ButtonIcon onClick={props.onCloseLikes}>
                  <LucideChevronLeft />
                </ButtonIcon>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-y-5'>
            <div className='p-5'>
              {likers.map((liker) => (
                <div key={liker.id}>
                  {liker.deleted ? (
                    <Item user={liker} />
                  ) : (
                    <A
                      underline={false}
                      href={PageRoute.PROFILE(liker.id)}
                      className='w-full'
                      onClick={() => props.onCloseRequest()}>
                      <Item user={liker} />
                    </A>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type ItemProps = {
  user: User;
};

const Item = (props: Readonly<ItemProps>) => {
  const { user } = props;

  return (
    <div className='flex items-center gap-x-5 hover:bg-white/10 p-2 rounded-xl'>
      <AppUserAvatar user={user} />
      <span>{user.username}</span>
    </div>
  );
};
