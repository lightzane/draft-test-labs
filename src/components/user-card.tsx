import { Link } from 'react-router-dom';

import { PageRoute } from '../constants';
import { User } from '../models';
import { cn } from '../utils';
import AppUserAvatar from './user-avatar';

type Props = {
  user: User;
};

export default function AppUserCard(props: Readonly<Props>) {
  const { user } = props;

  return (
    <Link
      data-testid={`register-card`}
      to={PageRoute.PROFILE(user.id)}
      className={cn(
        'group relative flex flex-shrink-0 items-center gap-x-3 rounded-lg w-full max-w-xs p-3 cursor-pointer animate-enter',
        'bg-dracula-dark shadow-sm hover:shadow-lg',
      )}>
      <div className='flex-shrink-0'>
        <AppUserAvatar user={user} />
      </div>
      <div className='flex flex-col flex-shrink-0 max-w-[14rem]'>
        <span
          className='font-semibold truncate'
          data-testid='register-card-fullname'>
          {user.fullname}
        </span>
        <span
          className='text-sm text-gray-400 truncate'
          data-testid='register-card-description'>
          {user.description}
        </span>
      </div>

      <div
        className={cn(
          'absolute inset-0 mx-auto rounded-lg border-b-2 border-b-dracula-pink',
          'transition-all ease-in-out duration-300',
          'group-hover:w-full w-0',
        )}></div>
    </Link>
  );
}
