import { Toaster } from 'react-hot-toast';

export default () => (
  <Toaster
    position='top-center'
    toastOptions={{
      className: 'text-sm',
      duration: 5000,
      style: {
        borderRadius: '0.2rem',
        borderBottomLeftRadius: '0.5rem', // 1.5rem
        borderBottomRightRadius: '0.5rem', // 1.5rem
        // 'font-size': '.8rem',
        zIndex: '9999',
        backgroundColor: '#343746', // dracula-dark
        color: '#f8f8f2', // .dracula-light
        borderTopColor: 'hsla(265deg, 89%, 78%, 1)', // dracula-purple
        borderTopWidth: '1px',
      },
    }}
  />
);
