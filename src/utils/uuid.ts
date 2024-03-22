export const uuid = () => {
  const m = Math;
  const h = 16;
  const v = (n: number) => m.floor(n).toString(h);
  const u = (x: number) => ' '.repeat(x).replace(/./g, () => v(m.random() * h));

  return `${u(8)}-${u(4)}-${u(4)}-${u(4)}-${u(12)}`;
};
