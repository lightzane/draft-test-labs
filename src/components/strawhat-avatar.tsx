import { User } from '../models';
import { cn } from '../utils';

type Props = {
  user: User;
  size?: number;
};

export default function AppStrawHatAvatar(props: Readonly<Props>) {
  const { user, size } = props;

  return (
    <img
      data-testid='avatar'
      alt={user.username}
      src={`./strawhats/${user.username.toLowerCase()}.png`}
      className={cn('w-10 h-10 rounded-full object-fill', {
        'w-40 h-40': size && size === 150, // profile
        'w-24 h-24': size && size === 100, // home aside
        'w-9 h-9': size && size === 35, // add comment section
        'w-7 h-7': size && size === 30, // add comment section (reply)
      })}
    />
  );
}
