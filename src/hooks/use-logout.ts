import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { PageRoute } from '../constants';
import { User } from '../models';
import { useUserStore } from '../stores';

type LogoutOptions = {
  /** Use `PageRoute`, @example `PageRoute.HOME()` */
  redirect?: string;

  /** Search parameters for redirect */
  search?: string;

  /** When true, disables the toast message @default false */
  silent?: boolean;
};

export const useLogout = (options?: LogoutOptions) => {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const [redirect] = useState(options?.redirect || PageRoute.LOGIN());
  const [search] = useState(options?.search);
  const [silent] = useState(options?.silent || false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const handleLogout = () => {
    if (!loggedInUser) {
      console.error('Hey developer, please "setLoggedInUser()" to logout');
      return;
    }

    setUser(loggedInUser, false); // remove localStorage

    navigate({
      pathname: redirect,
      search,
    });

    if (!silent) {
      toast(`See ya ${loggedInUser.firstname}!`, {
        className: 'text-lg',
        icon: '👋',
      });
    }
  };

  return { handleLogout, setLoggedInUser };
};
