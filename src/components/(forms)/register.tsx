import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toast } from 'react-hot-toast';
import { createSearchParams, useNavigate } from 'react-router-dom';

import { password as __PASSWORD__ } from '../../utils';

import {
  LucideCheck,
  LucideCopy,
  LucideLightbulb,
  LucideX,
  LucideZap,
} from 'lucide-react';
import { Confetti } from '../../assets/scripts';
import { PageRoute } from '../../constants';
import { useMatchWords, usePasswordErrors } from '../../hooks';
import { User, UserInput, UserSchema } from '../../models';
import { useActivityStore, usePostStore, useUserStore } from '../../stores';
import { STRAWHATS, cn, loadSampleData } from '../../utils';
import AppRegisteredUsers from '../registered-users';
import { A, Button, ButtonIcon, InputText, SectionTitle } from '../ui';

export default function AppRegisterForm() {
  const { users, addUser } = useUserStore();
  const { addPost } = usePostStore();
  const { addActivity } = useActivityStore();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState,
    getValues,
    setError,
    setValue,
    clearErrors,
  } = useForm<UserInput>({
    resolver: zodResolver(UserSchema),
    mode: 'onChange', // triggers validation on input change
  });

  const { ref: fnRef, ...fnRest } = register('firstname');
  const { ref: lnRef, ...lnRest } = register('lastname');
  const { ref: unRef, ...unRest } = register('username');
  const { ref: pwRef, ...pwRest } = register('password');

  const passwordRef2 = useRef<HTMLInputElement>(null);

  const { errors: pwdErrors, setPasswordInput } = usePasswordErrors();
  const { isMatch, matchWords } = useMatchWords();

  const [strawhatsExist, setStrawhatsExist] = useState(false);

  const onSubmit = handleSubmit((data) => {
    if (!isMatch) {
      return;
    }

    const regex = new RegExp(`\\b${data.username}\\b`, 'i');
    const existing = users.find((u) => regex.test(u.username));

    if (existing) {
      setError('username', {
        message: `Username "${data.username}" already taken`,
      });
      toast.error(`User already taken`);
    }

    // New user
    else {
      navigate({
        pathname: PageRoute.LOGIN(),
        search: createSearchParams({
          u: data.username,
        }).toString(),
      });
      Confetti.fire();
      addUser(new User(data));
      toast.success('Registered successfully');
    }
  });

  const handlePasswordMatch = () => {
    const pw = getValues('password');
    matchWords([pw, passwordRef2.current?.value]);
  };

  /** Auto fills the username with firstname.lastname */
  const handleUsernameAutoFill = () => {
    const { firstname, lastname } = getValues();

    let combined = '';

    // firstname only
    if (firstname && !lastname) {
      combined = firstname;
    }

    // lastname only
    else if (!firstname && lastname) {
      combined = lastname;
    }

    // both
    else if (firstname && lastname) {
      combined = `${lastname}_${firstname}`;
    }

    const username = combined.replace(/\s/g, '');
    setValue('username', username);

    UserSchema.pick({ username: true })
      .safeParseAsync({ username })
      .then((result) => {
        if (!result.success) {
          setError('username', {
            message: result.error.issues[0].message,
          });
        } else {
          clearErrors('username');
        }
      });
  };

  const handleLoad = () => {
    if (isStrawhatsExist()) {
      toast.error('Already loaded');
      return;
    }

    const { users: strawhats, posts } = loadSampleData(
      addActivity,
      (asyncPosts) => {
        asyncPosts.forEach(addPost);
      },
    );

    strawhats.forEach(addUser);
    posts.forEach(addPost);

    // toast.success('Samples loaded!');
    toast.custom((t) => <AppQuickSetupSuccessPopup t={t} />, {
      duration: Infinity,
    });

    setStrawhatsExist(true);
  };

  // ! Check of strawhats already exists
  useEffect(() => {
    new Promise<boolean>((resolve) => {
      if (isStrawhatsExist()) {
        resolve(true);
      }
      resolve(false);
    }).then(setStrawhatsExist);
  }, [users]);

  const isStrawhatsExist = () => {
    for (const user of users) {
      if (STRAWHATS.includes(user.username)) {
        return true;
      }
    }
    return false;
  };

  return (
    <div
      className={cn('px-4 grid grid-cols-1 gap-y-5', {
        'sm:grid-cols-3': !!users.length,
      })}>
      <div className='col-span-2 items-center flex flex-col gap-y-5'>
        {/* Hint for Sample Data */}
        {!strawhatsExist && (
          <div className='rounded-lg mx-auto w-full sm:max-w-lg bg-dracula-green/10 ring-2 ring-dracula-green/60'>
            <div className='flex flex-col gap-y-1 p-3 px-5'>
              <h2 className='leading-6 font-bold flex items-center gap-x-1'>
                <LucideLightbulb size={20} />
                <span>Getting Started</span>
              </h2>
              <p className='leading-6 sm:text-sm'>
                Get up and running quickly by populating with sample users,
                posts and comments for instant content.
              </p>
              <div className='flex justify-end'>
                <Button
                  rare
                  onClick={handleLoad}
                  className='flex items-center gap-x-1'
                  data-testid='quick-setup'>
                  <LucideZap size={18} />
                  <span>Quick Setup</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        <SectionTitle>
          <span data-testid='page-heading'>Registration</span>
        </SectionTitle>

        <div>
          <div className='leading-6 sm:text-sm flex flex-row gap-x-1'>
            <span className='text-gray-400'>Already have an account?</span>
            <A
              href={PageRoute.LOGIN()}
              className='font-semibold'
              data-testid='account-login'>
              Log In
            </A>
          </div>
        </div>

        <div className='flex flex-col sm:items-center w-full gap-y-5'>
          {/* Registration form */}
          <form className='max-w-lg flex flex-col gap-y-5' onSubmit={onSubmit}>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
              <InputText
                id='first-name'
                required
                ref={fnRef}
                {...fnRest}
                label='First name'
                placeholder='Robin'
                errors={formState.errors.firstname?.message}
                onKeyUp={handleUsernameAutoFill}
              />
              <InputText
                id='last-name'
                ref={lnRef}
                {...lnRest}
                label='Last name'
                placeholder='Nico'
                errors={formState.errors.lastname?.message}
                onKeyUp={handleUsernameAutoFill}
              />
            </div>
            <InputText
              id='username'
              required
              ref={unRef}
              {...unRest}
              label='Username'
              errors={formState.errors.username?.message}
              placeholder='nico.robin'
              hint='This cannot be changed later'
            />
            <InputText
              id='password'
              required
              ref={pwRef}
              {...pwRest}
              label='Password'
              type='password'
              errors={pwdErrors}
              onKeyUp={(e) => {
                handlePasswordMatch();
                setPasswordInput(e.currentTarget.value);
              }}
            />
            <InputText
              id='confirm-password'
              required
              ref={passwordRef2}
              label='Confirm password'
              type='password'
              errors={!isMatch && 'Password did not matched'}
              onKeyUp={handlePasswordMatch}
            />
            <div className='flex justify-center py-5'>
              <Button
                primary={formState.isValid}
                disabled={
                  !formState.isValid ||
                  formState.isSubmitting ||
                  formState.isSubmitSuccessful ||
                  !isMatch
                }
                type='submit'
                className='w-full max-w-xs'
                data-testid='form-submit'>
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>

      {!!users.length && <AppRegisteredUsers />}
    </div>
  );
}

type QuickSetupSuccessPopupProps = {
  t: Toast;
};

const AppQuickSetupSuccessPopup = ({ t }: QuickSetupSuccessPopupProps) => {
  const pwd = __PASSWORD__;

  const [closed, setClosed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClose = () => {
    toast.dismiss(t.id);
    setClosed(true);
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(pwd).then(() => {
        setCopied(true);
      });
    }
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (copied) {
      timeout = setTimeout(() => {
        setCopied(false);
      }, 2500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);

  return (
    <div
      className={cn(
        'animate-toast-enter rounded-lg bg-dracula-dark/80 backdrop-blur-sm shadow-lg w-full max-w-xs relative',
        { 'animate-toast-leave': closed },
      )}>
      <div className='border-b-[1px] border-b-dracula-pink'>
        <div className='flex flex-row justify-between items-center py-1 pl-3'>
          <span className='sm:text-sm font-semibold text-dracula-green'>
            Quick Setup Successful
          </span>
          <div className='flex flex-row justify-end'>
            <ButtonIcon onClick={handleClose} data-testid='x'>
              <LucideX size={18} />
            </ButtonIcon>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-y-2 py-3 px-3'>
        <p className='leading-6 sm:text-sm text-dracula-light'>
          Password for sample users
        </p>
        <div className='p-1 pl-3 rounded-md bg-dracula-darker text-sm font-mono flex flex-row items-center justify-between overflow-hidden'>
          <span className='text-gray-400 select-none'>
            "
            <span
              className='text-dracula-light select-text'
              data-testid='password'>
              {pwd}
            </span>
            "
          </span>
          {!copied && (
            <ButtonIcon
              onClick={handleCopy}
              className='animate-toast-enter'
              data-testid='password-copy'>
              <LucideCopy size={18} />
            </ButtonIcon>
          )}

          {copied && (
            <ButtonIcon
              disabled
              className='animate-enter'
              data-testid='password-copied'>
              <LucideCheck className='text-dracula-green' size={18} />
            </ButtonIcon>
          )}
        </div>
      </div>
    </div>
  );
};
