export const MUST_NOT_BE_EMPTY = 'Must not be empty';
export const MUST_BE_ALPHA = 'Must contain alpha characters only';
export const MUST_NOT_CONTAIN_SPACE = 'Must NOT contain a space';
export const MUST_BE_ALPHANUMERIC_OR_UNDERSCORE =
  'Must contain alphanumeric or underscore "_" characters only';

export const POST_EXAMPLES = (n?: number) => {
  const examples = [
    `img:https://assets1.ignimgs.com/2019/08/27/sky-children-1566939583880.jpeg\n\n✨ Sky Children of the Light 💗`,
    `img:https://vitejs.dev/logo-with-shadow.png\n\n⚡Lightning fast!`,
    `joke`, // triggers the Fetch api to get jokes
  ];

  const pick = n ?? Math.floor(Math.random() * examples.length);

  return examples[pick];
};
