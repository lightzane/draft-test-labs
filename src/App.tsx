import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

import AppCommentsModal from './components/(comments)/comments.modal';
import AppPostLikesModal from './components/(posts)/post-likes.modal';
import AppWritePostModal from './components/(posts)/write-post.modal';
import AppHeader from './components/header';
import { Container } from './components/ui';
import { StoragePrefixKey } from './constants';
import { usePostStore, useUserStore } from './stores';

export default function App() {
  const { user, addUser, setUser, setSave: setUserSave } = useUserStore();
  const { addPost, setSave: setPostSave } = usePostStore();
  // ! Retrieve saved data from localStorage
  useEffect(() => {
    const localStorage = window.localStorage;
    // TEMPORARY TESTING FOR RECENTLY ADDED SPA SCRIPT
    localStorage.setItem('save', '1');

    if (!localStorage.getItem('save')) {
      setUserSave(false);
      setPostSave(false);
      localStorage.clear(); // delete all localStorage data
      return;
    } else {
      setUserSave(true);
      setPostSave(true);
      console.log('Loading data...');
    }

    Object.entries(localStorage).forEach(([k, v]) => {
      // Users list
      if (StoragePrefixKey.USER.regex.test(k)) {
        addUser(JSON.parse(v));
      }

      // Logged-in user
      if (StoragePrefixKey.LOGGED_IN_USER.regex.test(k)) {
        setUser(JSON.parse(v));
      }

      // Posts list
      if (StoragePrefixKey.POST.regex.test(k)) {
        addPost(JSON.parse(v));
      }
    });
  }, []);

  return (
    <div className='h-full'>
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

      <div className='flex flex-col justify-between h-screen'>
        <div>
          <AppHeader></AppHeader>

          <div className=''>
            {/* Display Pages inside this <Outlet /> */}
            <Outlet />

            {/* Modal for all the pages */}
            {<AppPostLikesModal />}
            {user && <AppWritePostModal />}
            {user && <AppCommentsModal />}
          </div>
        </div>

        <div className='mt-20'>
          <Container>
            <footer className='px-4 pb-5'>
              <div className='flex flex-row justify-between'>
                <div className='text-gray-400 text-sm flex flex-col'>
                  <span>Lightzane &copy; 2024</span>
                  <span className='text-xs'>For testing purposes only</span>
                </div>
              </div>
            </footer>
          </Container>
        </div>
      </div>
    </div>
  );
}
