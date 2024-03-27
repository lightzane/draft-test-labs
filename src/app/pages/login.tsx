import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import AppLoginForm from '../../components/(forms)/login';
import AppScrolly from '../../components/scrolly';
import { Container, PageContainer } from '../../components/ui';
import AppUserAvatar from '../../components/user-avatar';
import { PageRoute } from '../../constants';
import { useUserStore } from '../../stores';

export default function LoginPage() {
  document.title = PageRoute.LOGIN.title;

  const [searchParams /*, setSearchParams */] = useSearchParams();

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
    searchParams.set('u', username);

    navigate(
      {
        pathname: PageRoute.LOGIN(),
        search: searchParams.toString(),
      },
      {
        replace: true,
      },
    );
  };

  return (
    <Container className=''>
      <PageContainer>
        <div className='mb-1 mx-auto max-w-lg flex flex-col gap-3'>
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
        <AppLoginForm />
      </PageContainer>
    </Container>
  );
}
