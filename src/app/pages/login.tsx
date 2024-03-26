import { useEffect } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';

import AppLoginForm from '../../components/(forms)/login';
import { Container, PageContainer } from '../../components/ui';
import { PageRoute } from '../../constants';
import { useUserStore } from '../../stores';
import AppScrolly from '../../components/scrolly';
import AppUserAvatar from '../../components/user-avatar';

export default function LoginPage() {
  document.title = PageRoute.LOGIN.title;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const { user, users } = useUserStore();

  useEffect(() => {
    if (user) {
      navigate(PageRoute.HOME());
    }
  }, [user]);

  const handleAvatarClick = (username: string) => {
    navigate(
      {
        pathname: PageRoute.LOGIN(),
        search: createSearchParams({
          u: username,
        }).toString(),
      },
      {
        replace: true,
      },
    );
  };

  return (
    <Container className='pt-5 sm:pt-20'>
      <PageContainer>
        <AppLoginForm />
        <div className='mt-10 mx-auto max-w-lg flex flex-col gap-3'>
          <AppScrolly>
            {users.map((user) => (
              <button
                key={user.id}
                title={user.username}
                className='outline-none rounded-full'
                onClick={() => handleAvatarClick(user.username)}>
                <AppUserAvatar user={user} />
              </button>
            ))}
          </AppScrolly>
          <AppScrolly direction='right'>
            {users.map((user) => (
              <button
                key={user.id}
                title={user.username}
                className='outline-none rounded-full'
                onClick={() => handleAvatarClick(user.username)}>
                <AppUserAvatar user={user} />
              </button>
            ))}
          </AppScrolly>
        </div>
      </PageContainer>
    </Container>
  );
}
