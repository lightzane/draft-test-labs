import { useEffect, useState } from 'react';

type MatchWords = string | undefined | null;

/** Simply matches (exact) 2 strings */
export const useMatchWords = () => {
  const [isMatch, setIsMatch] = useState(false);
  const [words, matchWords] = useState<[MatchWords, MatchWords]>(['', '']);

  const validate = async () => {
    const [word1, word2] = words;

    if (word1 === word2) {
      setIsMatch(true);
    } else {
      setIsMatch(false);
    }
  };

  useEffect(() => {
    validate();
  }, [words]);

  return { isMatch, matchWords };
};
