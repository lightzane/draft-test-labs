export const kebab = (text = '') => {
  text = text.toLowerCase();
  return text.replace(/\s/g, '-');
};
