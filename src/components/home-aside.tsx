import { LucideLogOut } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { navs } from '../constants';
import { useLogout } from '../hooks';
import { useUserStore } from '../stores';
import { cn, kebab } from '../utils';
import AppCounters from './counters';
import AppUserAvatar from './user-avatar';

export default function AppHomeAside() {
  const { user } = useUserStore();
  const { handleLogout, setLoggedInUser } = useLogout();

  useEffect(() => {
    setLoggedInUser(user);
  }, [user]);

  return (
    <>
      {user && (
        <div className='flex flex-col gap-y-5'>
          <div className='flex flex-col items-center'>
            <div data-testid='aside-avatar'>
              <AppUserAvatar user={user} size={100} />
            </div>

            <p
              className='text-xl font-bold capitalize'
              data-testid='aside-fullname'>
              {user.fullname}
            </p>
            <p className='text-gray-400 truncate' data-testid='aside-username'>
              @{user.username}
            </p>

            {/* Counters */}
            <div className='pt-3'>
              <AppCounters user={user} />
            </div>
          </div>
          <ul className='font-semibold flex flex-col gap-y-3'>
            {navs.map((item) => (
              <li key={item.name} data-testid={`aside-nav-${kebab(item.name)}`}>
                <Link
                  to={{
                    pathname: item.route(user.id),
                    search: item.search,
                  }}>
                  <div
                    className={cn(
                      'py-2 px-3 rounded-xl hover:bg-dracula-dark',
                      'transition ease-in-out duration-300',
                    )}>
                    <div className='flex flex-row items-center gap-x-3'>
                      {<item.icon />}
                      <span>{item.name}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Logout */}
          <div className='flex flex-col gap-y-3'>
            <button
              onClick={handleLogout}
              className={cn(
                'py-2 px-3 rounded-xl hover:bg-dracula-dark',
                'transition ease-in-out duration-300 text-start',
                'flex flex-row items-center gap-x-3',
              )}>
              <LucideLogOut />
              <span className='font-semibold'>Log out</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
