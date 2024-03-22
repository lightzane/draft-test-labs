import { useNavigate } from 'react-router-dom';
import { Button, Container, PageContainer } from '../../components/ui';
import AppUserAvatar from '../../components/user-avatar';
import { PageRoute } from '../../constants';
import { useUserStore } from '../../stores';
import { useLogout } from '../../hooks/use-logout';
import { useEffect } from 'react';

export default function LogoutPage() {
  const navigate = useNavigate();

  const { user } = useUserStore();
  const { handleLogout, setLoggedInUser } = useLogout();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setLoggedInUser(user);
  }, [user]);

  return (
    <Container>
      <PageContainer>
        <div className='flex justify-center items-center h-56'>
          {user ? (
            <div className='ring-2 ring-dracula-blue ring-opacity-15 p-5 rounded-lg flex flex-col gap-5'>
              <div className='flex items-center gap-5'>
                <AppUserAvatar user={user} />
                <span className='text-sm leading-6'>
                  Logged in as <b>{user.username}</b>
                </span>
              </div>
              <Button danger onClick={handleLogout}>
                Sign out account
              </Button>
            </div>
          ) : (
            <Button primary onClick={() => navigate(PageRoute.LOGIN())}>
              Login
            </Button>
          )}
        </div>
      </PageContainer>
    </Container>
  );
}
