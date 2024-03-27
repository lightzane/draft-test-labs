import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  // prettier-ignore
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // https://en.wikipedia.org/wiki/Dracula_(color_scheme)
        dracula: {
          darker: 'hsl(231 15% 18%)',
          dark: 'hsl(232 14% 31%)',
          light: 'hsl(60 30% 96%)',
          blue: 'hsl(225 27% 51%)',
          cyan: 'hsl(191 97% 77%)',
          green: 'hsl(135 94% 65%)',
          orange: 'hsl(31 100% 71%)',
          pink: 'hsl(326 100% 74%)',
          purple: 'hsl(265 89% 78%)',
          red: 'hsl(0 100% 67%)',
          yellow: 'hsl(65 92% 76%)',
        },
      },
      animation: {
        enter: 'enter .5s ease-in-out forwards',
        'enter-delay': 'enter .5s ease-in-out .8s forwards',
        'spin-slow': 'spin 5s linear infinite',
        heart: 'heart 1s infinite',
        'toast-enter': 'toast-enter .2s ease-out',
        'toast-leave': 'toast-leave .15s ease-in forwards',
      },
      keyframes: {
        enter: {
          from: {
            opacity: 0,
            filter: 'blur(12px)',
            transform: 'translateY(1.25rem)',
          },
          to: {
            opacity: 1,
            filter: 'blur(0)',
            transform: 'translateY(0)',
          },
        },
        heart: {
          '0%, 40%, 80%, 100%': {
            transform: 'scale(1)',
          },
          '20%, 60%': {
            transform: 'scale(1.15)',
          },
        },
        'toast-enter': {
          from: {
            transform: 'translateY(2rem) scale(0.9)',
            opacity: 0,
          },
        },
        'toast-leave': {
          to: {
            transform: 'translateY(2rem) scale(0.9)',
            opacity: 0,
          },
        },
      },
      dropShadow: {
        sm: '0 0 3em hsl(191 97% 77%)', // cyan
        link: '0 0 1em hsl(191 97% 77%)', // cyan
        primary: '0 0 2em hsl(265 89% 78%)', // purple
        secondary: '0 0 2em hsl(326 100% 74%)', // pink
        warning: '0 0 2em hsl(31 100% 71%)', // orange
        rare: '0 0 2em hsl(191 97% 77%)', // cyan
        danger: '0 0 2em hsl(0 100% 67%)',
      },
    },
  },

  // prettier-ignore
  plugins: [
    require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};
