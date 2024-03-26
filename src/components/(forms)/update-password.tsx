import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { createSearchParams, useLocation } from 'react-router-dom';
import { MUST_NOT_BE_EMPTY, PageRoute } from '../../constants';
import { useLogout, useMatchWords, usePasswordErrors } from '../../hooks';
import { User, UserSchema } from '../../models';
import { useUserStore } from '../../stores';
import { Button, InputText } from '../ui';

type Props = {
  user: User;
};

const { password } = UserSchema.shape;

const UpdatePasswordSchema = z.object({
  oldPwd: z.string().min(1, MUST_NOT_BE_EMPTY),
  newPwd: password,
  repPwd: z.string(),
});

type UpdatePasswordType = z.infer<typeof UpdatePasswordSchema>;

export default function AppUpdatePasswordForm(props: Readonly<Props>) {
  const { user } = props;

  const location = useLocation();
  const { updateUser } = useUserStore();
  const { handleLogout, setLoggedInUser } = useLogout({
    redirect: PageRoute.LOGIN(),
    search: createSearchParams({
      u: user.username,
      redirect: location.pathname,
    }).toString(),
    silent: true,
  });

  const {
    register,
    formState,
    handleSubmit,
    setError,
    getValues,
    clearErrors,
  } = useForm<UpdatePasswordType>({
    resolver: zodResolver(UpdatePasswordSchema),
  });

  const { ref: oldPwdRef, ...oldPwdRest } = register('oldPwd');
  const { ref: newPwdRef, ...newPwdRest } = register('newPwd');
  const { ref: repPwdRef, ...repPwdRest } = register('repPwd');

  const { errors: pwdErrors, setPasswordInput } = usePasswordErrors();
  const { isMatch, matchWords } = useMatchWords();

  useEffect(() => {
    setLoggedInUser(user);
  }, [user]);

  const onSubmit = handleSubmit((data) => {
    if (user.password !== data.oldPwd) {
      setError('oldPwd', { message: 'Invalid password' });
      return;
    }

    updateUser({
      ...user,
      password: data.newPwd,
    });

    handleLogout();

    toast.success('Password updated. Please login again');
  });

  const handlePasswordMatch = () => {
    const pw1 = getValues('newPwd');
    const pw2 = getValues('repPwd');

    matchWords([pw1, pw2]);
  };

  useEffect(() => {
    if (isMatch) {
      clearErrors('repPwd');
    } else {
      setError('repPwd', { message: 'Passwords did not matched' });
    }
  }, [isMatch]);

  return (
    <form className='max-w-md' onSubmit={onSubmit}>
      <div className='flex flex-col gap-5'>
        <InputText
          id='old-password'
          type='password'
          ref={oldPwdRef}
          {...oldPwdRest}
          label='Old password'
          errors={formState.errors.oldPwd?.message}
        />
        <InputText
          id='new-password'
          type='password'
          ref={newPwdRef}
          {...newPwdRest}
          label='New password'
          errors={pwdErrors}
          onKeyUp={(e) => {
            handlePasswordMatch();
            setPasswordInput(e.currentTarget.value);
          }}
        />
        <InputText
          id='confirm-password'
          type='password'
          ref={repPwdRef}
          {...repPwdRest}
          label='Confirm new password'
          placeholder='Write new password again'
          errors={formState.errors.repPwd?.message}
          onKeyUp={handlePasswordMatch}
        />
        <div className='mt-10 flex flex-col gap-y-5'>
          <div>
            <Button
              data-testid='submit-update-password'
              type='submit'
              secondary={formState.isValid}
              disabled={
                !formState.isValid || formState.isSubmitSuccessful || !isMatch
              }>
              Update password
            </Button>
          </div>

          {formState.isValid && isMatch && (
            <p className='text-dracula-orange text-sm animate-enter'>
              Updating password will automatically sign you out.
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
