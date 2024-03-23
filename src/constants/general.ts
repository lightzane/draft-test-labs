export const MUST_NOT_BE_EMPTY = 'Must not be empty';
export const MUST_BE_ALPHA = 'Must contain alpha characters only';
export const MUST_NOT_CONTAIN_SPACE = 'Must NOT contain a space';
export const MUST_BE_ALPHANUMERIC_OR_UNDERSCORE =
  'Must contain alphanumeric or underscore "_" characters only';

export const STRAWHATS = [
  'monkey_d_luffy',
  'roronoa_zoro',
  'nami',
  'usopp',
  'vinsmoke_sanji',
  'tonytony_chopper',
  'nico_robin',
  'franky',
  'brook',
  'jinbe',
];

export const POST_EXAMPLES = (n?: number) => {
  const examples = [
    `img:https://assets1.ignimgs.com/2019/08/27/sky-children-1566939583880.jpeg\n\n✨ Sky Children of the Light 💗`,
    `img:https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ab9765a0-c82d-49b6-10b6-cb83561ec800/width=450/225596.jpeg\n\nHave a great day everyone!`,
    `img:https://vitejs.dev/logo-with-shadow.png\n\n⚡Lightning fast!`,
    `joke`,
  ];

  const pick = n ?? Math.floor(Math.random() * examples.length);

  return examples[pick];
};
