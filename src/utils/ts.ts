/** Timestamp `now` in **SECONDS** from epoch time. */
export const ts = () => {
  return Math.floor(Date.now() / 1000).toString();
};
