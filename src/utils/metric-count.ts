export const metricCount = (count: number, decimal = 0) => {
  if (isNaN(count)) return null;
  if (count === null) return null;
  if (count === 0) return '-';

  let exp: number;

  const suffixes = ['K', 'M', 'B', 'T', 'Q'];

  if (count < 1000) return count;

  exp = Math.floor(Math.log(count) / Math.log(1000));

  return (count / Math.pow(1000, exp)).toFixed(decimal) + suffixes[exp - 1];
};
