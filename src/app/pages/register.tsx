import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AppRegisterForm from '../../components/(forms)/register';
import { Container, PageContainer } from '../../components/ui';
import { PageRoute } from '../../constants';
import { useUserStore } from '../../stores';

export default function RegisterPage() {
  document.title = PageRoute.REGISTER.title;

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
    <Container className='pt-10'>
      <PageContainer>
        <AppRegisterForm />
      </PageContainer>
    </Container>
  );
}
