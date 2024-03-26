import Avatar from 'boring-avatars';

import { useEffect, useState } from 'react';
import { UNKNOWN_USER } from '../constants';
import { User } from '../models';
import { STRAWHATS } from '../utils';
import AppStrawHatAvatar from './strawhat-avatar';

type Props = {
  size?: number;
  user?: User;
};

export default function AppUserAvatar(props: Readonly<Props>) {
  const { size } = props;
  const [user, setUser] = useState(props.user || UNKNOWN_USER);
  const [fullname, setFullname] = useState(user.fullname);

  useEffect(() => {
    const u = props.user || UNKNOWN_USER;
    setUser(u);
    setFullname(u.fullname);
  }, [props.user]);

  return (
    <div className='inline-block rounded-full relative overflow-hidden select-none'>
      {STRAWHATS.includes(user.username.toLowerCase()) ? (
        <AppStrawHatAvatar user={user} size={size} />
      ) : (
        <div data-testid='avatar'>
          <Avatar
            size={size ?? 40}
            name={fullname}
            variant='ring'
            colors={[
              'hsl(191 97% 77%)',
              'hsl(135 94% 65%)',
              'hsl(31 100% 71%)',
              'hsl(326 100% 74%)',
              'hsl(265 89% 78%)',
              'hsl(0 100% 67%)',
              'hsl(65 92% 76%)',
            ]}
          />
        </div>
      )}
    </div>
  );
}
