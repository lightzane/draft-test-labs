export const fetchJoke = async () => {
  let joke = 'It was a joke...';

  const response = await fetch('https://icanhazdadjoke.com/', {
    headers: {
      Accept: 'application/json',
    },
  });

  if (response.ok) {
    const result = await response.json();
    joke = result.joke;
  }

  return joke;
};
