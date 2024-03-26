import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { MUST_NOT_BE_EMPTY } from '../../constants';
import { User, UserSchema } from '../../models';
import { useUserStore } from '../../stores';
import { Button, InputText } from '../ui';

type Props = {
  user: User;
};

const { firstname, lastname } = UserSchema.shape;

const UpdateProfileSchema = z.object({
  firstname,
  lastname,
  description: z.string().min(1, MUST_NOT_BE_EMPTY).max(30).default('User'),
});

type UpdateProfileType = z.infer<typeof UpdateProfileSchema>;

export default function AppUpdateProfileForm(props: Readonly<Props>) {
  const { user } = props;
  const { firstname, lastname, description } = user;
  const { updateUser } = useUserStore();
  const { register, formState, handleSubmit, reset } =
    useForm<UpdateProfileType>({
      resolver: zodResolver(UpdateProfileSchema),
      defaultValues: {
        firstname,
        lastname,
        description,
      },
      mode: 'onChange',
    });

  const { ref: fnRef, ...fnRest } = register('firstname');
  const { ref: lnRef, ...lnRest } = register('lastname');
  const { ref: dRef, ...dRest } = register('description');

  const onSubmit = handleSubmit((data) => {
    updateUser({
      ...user,
      ...data,
    });
    toast.success('Profile updated');
    reset(data);
  });

  return (
    <form className='flex flex-col gap-y-10' onSubmit={onSubmit}>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
        <InputText
          id='first-name'
          ref={fnRef}
          {...fnRest}
          label='First name'
          errors={formState.errors.firstname?.message}
        />
        <InputText
          id='last-name'
          ref={lnRef}
          {...lnRest}
          label='Last name'
          errors={formState.errors.lastname?.message}
        />
        <InputText
          id='description'
          ref={dRef}
          {...dRest}
          label='Description'
          errors={formState.errors.description?.message}
          hint='Keep it short'
        />
      </div>
      <div className='max-w-sm'>
        <Button
          data-testid='submit-update-profile'
          type='submit'
          secondary={formState.isValid}
          disabled={
            !formState.isValid || formState.isSubmitting || !formState.isDirty
          }>
          Update Profile
        </Button>
      </div>
    </form>
  );
}
