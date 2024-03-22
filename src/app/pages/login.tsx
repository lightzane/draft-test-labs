import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AppLoginForm from '../../components/(forms)/login';
import { Container, PageContainer } from '../../components/ui';
import { PageRoute } from '../../constants';
import { useUserStore } from '../../stores';

export default function LoginPage() {
  document.title = PageRoute.LOGIN.title;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (user) {
      navigate(PageRoute.HOME());
    }
  }, [user]);

  return (
    <Container className='pt-20'>
      <PageContainer>
        <AppLoginForm />
      </PageContainer>
    </Container>
  );
}
