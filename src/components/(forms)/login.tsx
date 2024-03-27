import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { useEffect, useRef } from 'react';
import { PageRoute } from '../../constants';
import { useUserStore } from '../../stores';
import { A, SectionTitle, Button, InputText } from '../ui';

const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

type LoginType = z.infer<typeof LoginSchema>;

export default function AppLoginForm() {
  const [searchParams /*, setSearchParams */] = useSearchParams();
  const { users, setUser } = useUserStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState, setError, setValue } =
    useForm<LoginType>({
      resolver: zodResolver(LoginSchema),
      mode: 'onChange',
    });

  const { ref: passwordRef, ...passwordRest } = register('password');
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchParams) {
      const u = searchParams.get('u');
      setValue('username', u ?? '');
      u && ref.current?.focus();
    }
  }, [searchParams]);

  const handleForm = handleSubmit((data) => {
    const { username, password } = data;
    const existing = users.find(
      (u) => u.username === username && u.password === password,
    );

    if (!existing) {
      const message = 'Invalid username or password';
      toast.error(message);
      setError('root', { message });
    }

    // User found
    else {
      toast(`Hi ${existing.firstname}`, {
        className: 'text-lg',
        icon: '👋',
      });

      setUser(existing);

      let redirect = searchParams.get('redirect') ?? PageRoute.HOME();

      if (redirect === '/') {
        redirect = PageRoute.HOME();
      }

      navigate(redirect);
    }
  });

  return (
    <div className='px-4 mx-auto max-w-lg'>
      <div className='flex flex-col gap-y-5'>
        <SectionTitle className='text-center'>
          <span data-testid='page-heading'>Login to your Account</span>
        </SectionTitle>
        <form className='max-w-lg flex flex-col gap-y-5' onSubmit={handleForm}>
          <div className='w-full mx-auto max-w-sm flex flex-col gap-y-5'>
            <InputText
              id='username'
              {...register('username')}
              label='Username'
              errors={formState.errors.username?.message}
              autoFocus
              data-testid='username'
            />
            <InputText
              id='password'
              ref={(e) => {
                passwordRef(e);
                ref.current = e;
              }}
              {...passwordRest}
              label='Password'
              type='password'
              errors={formState.errors.password?.message}
              autoFocus={!!searchParams.get('u')}
              data-testid='password'
            />
            <div className='mt-3 flex flex-col gap-y-5'>
              <Button
                primary={formState.isValid}
                type='submit'
                className='w-full'
                disabled={
                  !formState.isValid ||
                  formState.isSubmitting ||
                  formState.isSubmitSuccessful
                }
                data-testid='form-login'>
                Log In
              </Button>

              <div className='flex justify-center text-sm'>
                <A href={PageRoute.REGISTER()}>
                  <span data-testid='create-account'>Create Account</span>
                </A>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
