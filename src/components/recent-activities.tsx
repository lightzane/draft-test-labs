import { LucideLoader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useActivityStore } from '../stores';
import AppTimeAgo from './time-ago';
import { kebab } from '../utils';

export default function AppRecentActivities() {
  const { activities } = useActivityStore();

  const [loading, setLoading] = useState(true);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const el = iframeRef.current;

    const load = () => {
      setLoading(false);
    };

    if (el) {
      el.addEventListener('load', load);
      el.addEventListener('error', load);
    }

    return () => {
      el?.removeEventListener('load', load);
      el?.removeEventListener('error', load);
    };
  }, []);

  return (
    <div className='flex flex-col gap-y-5 relative'>
      {/* Loading iFrame */}
      {loading && (
        <div className='rounded-lg bg-gray-700 animate-pulse w-[360px] h-[200px] absolute flex items-center justify-center'>
          <LucideLoader2 className='animate-spin text-dracula-yellow' />
        </div>
      )}

      {/* iFrame */}
      <iframe
        ref={iframeRef}
        title='Utility local time'
        src='https://lightzane.github.io/local-time'
        width={360}
        height={200}
      />

      {/* No activities */}
      {!activities.length && (
        <div
          className='text-gray-400 text-sm'
          data-testid='label-no-activities'>
          No activities yet...
        </div>
      )}

      {/* List of activities */}
      {!!activities.length && (
        <div className='h-72 overflow-y-auto flex flex-col gap-y-3'>
          {activities.map(({ id, username, action, createdTs }) => (
            <div
              key={id}
              className='flex flex-col gap-x-1 text-sm animate-enter'
              data-testid={`${kebab(username)}-activity`}>
              <p className='leading-6 flex flex-row gap-x-1'>
                <span
                  className='font-bold text-dracula-light'
                  data-testid='activity-username'>
                  {username}
                </span>
                <span className='text-gray-300' data-testid='activity-action'>
                  {action}
                </span>
              </p>
              <AppTimeAgo time={+createdTs} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
