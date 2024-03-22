export const timeAgoIntervals = {
  year: 31536000,
  month: 2592000,
  week: 604800,
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1,
};

export const timeAgo = (value: number) => {
  const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);

  if (seconds < 29) {
    // less than 30 seconds ago will show as 'Just now'
    return 'Just now';
  }

  let counter: number;

  for (const [key, value] of Object.entries(timeAgoIntervals)) {
    counter = Math.floor(seconds / value);
    if (counter > 0) {
      if (counter === 1) {
        return counter + ' ' + key; // singular (1 day ago)
      } else {
        return counter + ' ' + key + 's'; // plural (2 days ago)
      }
    }
  }

  return value.toLocaleString();
};
