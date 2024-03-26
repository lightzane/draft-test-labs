import { useUserStore } from '../stores';
import AppUserCard from './user-card';

export default function AppRegisteredUsers() {
  const users = useUserStore((state) => state.users);

  return (
    <div className='flex flex-col gap-y-5 pb-10 animate-enter overflow-auto h-[80vh]'>
      <p
        className='flex justify-center gap-x-1 text-sm text-gray-400 tracking-wide sticky top-0 py-3 bg-dracula-darker z-10'
        data-testid='text-users-registered'>
        <span
          className='font-semibold text-dracula-light'
          data-testid='users-registered'>
          {users.length}
        </span>{' '}
        user{users.length > 1 ? 's' : ''} registered
      </p>

      <div className='flex flex-col gap-5 items-center'>
        {[...users]
          .sort((a, b) => +b.lastActivity - +a.lastActivity)
          .map((u) => (
            <AppUserCard key={u.id} user={u} />
          ))}
      </div>
    </div>
  );
}
