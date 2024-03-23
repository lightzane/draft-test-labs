import { useActivityStore } from '../stores';
import AppTimeAgo from './time-ago';

export default function AppRecentActivities() {
  const { activities } = useActivityStore();

  return (
    <div className='flex flex-col gap-y-5'>
      <iframe
        src='https://lightzane.github.io/local-time'
        width={360}
        height={200}
      />

      {/* No activities */}
      {!activities.length && (
        <div className='text-gray-400 text-sm'>No activities yet...</div>
      )}

      {/* List of activities */}
      {!!activities.length && (
        <div className='h-72 overflow-y-auto flex flex-col gap-y-3'>
          {activities.map(({ id, username, action, createdTs }) => (
            <div
              key={id}
              className='flex flex-col gap-x-1 text-sm animate-enter'>
              <p className='leading-6 flex flex-row gap-x-1'>
                <span className='font-bold text-dracula-light'>{username}</span>
                <span className='text-gray-300'>{action}</span>
              </p>
              <AppTimeAgo time={+createdTs} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
