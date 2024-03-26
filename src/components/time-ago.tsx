import { useEffect, useState } from 'react';
import { timeAgo, timeAgoIntervals } from '../utils';

type Props = {
  /** In seconds number */
  time: number;
};

export default function AppTimeAgo(props: Readonly<Props>) {
  const { time } = props;
  const [value, setValue] = useState('');

  useEffect(() => {
    const timeMs = time * 1000;
    const diff = (+new Date() - +new Date(timeMs)) / 1000;
    const week = diff / timeAgoIntervals.week;

    // Display time ago when less than a week
    if (week < 1) {
      setValue(timeAgo(timeMs));
    }

    // Over a week, display the DATE instead
    else {
      const date = new Date(timeMs);

      let year: 'numeric' | undefined = undefined;

      // Hide same year
      if (date.getUTCFullYear() !== new Date().getUTCFullYear()) {
        year = 'numeric';
      }

      setValue(
        date.toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          year,
        }),
      );
    }
  }, [time]);

  return (
    <span className='text-xs text-gray-400' data-testid='time-ago'>
      {value}
    </span>
  );
}
