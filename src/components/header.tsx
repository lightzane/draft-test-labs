import { useEffect, useState } from 'react';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';

import { LucideLogOut } from 'lucide-react';
import { PageRoute, navs } from '../constants';
import { useLogout, useScrollListener } from '../hooks';
import { useUserStore } from '../stores';
import { cn } from '../utils';
import Logo from './logo';
import AppMenu from './menu';
import { A, Button, Container } from './ui';
import AppUserAvatar from './user-avatar';

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useUserStore();

  const [show, setShow] = useState(true); // show header
  const [shadow, setShadow] = useState(false); // show header shadow
  const { handleLogout, setLoggedInUser } = useLogout();

  useScrollListener({
    onScrollUp(scrollY) {
      setShow(true);

      if (scrollY >= 70) {
        setShadow(true);
      }
    },
    onScrollDown(scrollY) {
      if (scrollY <= 70) {
        setShadow(false);
        return;
      }

      setShow(false);
    },
  });

  const handleLoginClick = () => {
    let search: string | undefined = undefined;

    const redirect = location.pathname;

    if (!/login|register/.test(redirect)) {
      search = createSearchParams({
        redirect: encodeURI(redirect),
      }).toString();
    }

    navigate({
      pathname: PageRoute.LOGIN(),
      search,
    });
  };

  useEffect(() => {
    setLoggedInUser(user);
  }, [user]);

  return (
    <header
      className={cn(
        'sticky top-0 bg-dracula-darker/80 backdrop-blur-md z-10',
        'px-4 border-b-[1px] border-b-dracula-purple',
        'transition-all ease-in-out duration-300',
        {
          'translate-y-0': show,
          '-translate-y-full': !show,
          'shadow-lg drop-shadow-lg': shadow,
        },
      )}>
      <Container className='py-2'>
        <div className='flex items-center justify-between'>
          <A
            data-testid='app-title'
            underline={false}
            href={user ? PageRoute.HOME() : PageRoute.WELCOME()}
            className='group flex items-center gap-x-5 hover:text-dracula-cyan'>
            <div className='text-dracula-cyan animate-spin-slow group-hover:drop-shadow-[0_0_1em_white] transition-all ease-in-out duration-300'>
              <Logo />
            </div>
            <h1 className='group-hover:drop-shadow-link transition-all ease-in-out duration-300'>
              {PageRoute.HOME.title}
            </h1>
          </A>
          <ul className='flex items-center gap-x-5'>
            {user ? (
              <li className='animate-enter'>
                <AppMenu
                  triggerTemplate={
                    <div
                      className='hover:drop-shadow-link'
                      data-testid='header-avatar'>
                      <AppUserAvatar user={user} size={35} />
                    </div>
                  }
                  className='bg-dracula-dark/90 mt-14 w-[200px]'
                  items={[
                    ...navs.map(({ name, icon, route, search }) => ({
                      name,
                      icon,
                      action() {
                        navigate({
                          pathname: route(user.id),
                          search,
                        });
                      },
                    })),
                    {
                      name: 'Log out',
                      icon: LucideLogOut,
                      danger: true,
                      action: handleLogout,
                    },
                  ]}
                />
              </li>
            ) : (
              <li>
                <Button
                  data-testid='login'
                  primary
                  onClick={handleLoginClick}
                  className='flex items-center gap-x-1'>
                  <span>Log In</span>
                </Button>
              </li>
            )}
          </ul>
        </div>
      </Container>
    </header>
  );
}
