import toast from 'react-hot-toast';
import {
  useActivityStore,
  useGeneralStore,
  usePostStore,
  useUserStore,
} from '../../stores';
import { cn, handleBeforeUnload } from '../../utils';
import { AppMiscCard } from './misc-card';

type Props = {
  observer?: IntersectionObserver;
};

export const AppMiscCards = ({ observer }: Props) => {
  const { saveEnabled } = useGeneralStore();
  const clearAllUsers = useUserStore((state) => state.deleteAll);
  const clearAllPosts = usePostStore((state) => state.deleteAll);
  const clearAllActivities = useActivityStore((state) => state.deleteAll);

  const handlePersist = () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);

    if (saveEnabled) {
      window.localStorage.removeItem('save');
    }

    // User is enabling persist feature
    else {
      window.localStorage.setItem('save', 'enabled');
    }

    window.location.reload(); // in order the for localStorage "save" to take effect
  };

  const handleClearAll = () => {
    const { localStorage } = window;
    const hasSaveKey = localStorage.getItem('save');

    localStorage.clear();

    if (hasSaveKey) {
      localStorage.setItem('save', hasSaveKey);
    }

    clearAllUsers();
    clearAllPosts();
    clearAllActivities();

    toast.success('All clear!');
  };

  return (
    <>
      <AppMiscCard
        observer={observer}
        color={saveEnabled ? 'green' : 'gray'}
        title={
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-bold'>Persist</h2>
            <div className='flex flex-row gap-x-2 items-center'>
              <div
                className={cn('w-2.5 h-2.5 rounded-full', {
                  'bg-dracula-blue': !saveEnabled,
                  'bg-dracula-green shadow-[0_0_10px_2px_hsl(135,94%,65%)]':
                    saveEnabled,
                })}></div>
              <span
                className='sm:text-sm'
                data-testid={`persist-${saveEnabled ? 'on' : 'off'}`}>
                {saveEnabled ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
        }
        description={
          <p className='leading-6'>
            {!saveEnabled ? (
              <span>
                By default, when the page is refreshed, the data is lost. Enable
                this feature to persist the data. Nonetheless, the data will
                still persist when navigating between pages even if this feature
                is disabled.
              </span>
            ) : (
              <span>
                Data is persisting on browser's local storage even on page
                reload. Data will be <b className='text-dracula-light'>lost</b>{' '}
                if this feature is{' '}
                <b className='text-dracula-light'>disabled</b> or browser is
                closed when running on{' '}
                <b className='text-dracula-light'>incognito</b> mode.
              </span>
            )}
          </p>
        }
        buttonName={saveEnabled ? 'Disable' : 'Enable'}
        action={handlePersist}
        buttonHint={
          <p className='text-sm text-gray-400 leading-6'>
            Data will be lost when toggling this feature
          </p>
        }
      />

      <AppMiscCard
        observer={observer}
        color='orange'
        title='Cleanup'
        description='Start fresh from ground zero 
                    and remove all data such as users, posts, comments.'
        buttonName='Clear all'
        action={handleClearAll}
      />
    </>
  );
};
