import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import AppCommentsModal from './components/(comments)/comments.modal';
import AppPostLikesModal from './components/(posts)/post-likes.modal';
import AppWritePostModal from './components/(posts)/write-post.modal';
import AppFooter from './components/app-footer';
import AppToaster from './components/app-toaster';
import AppHeader from './components/header';
import { useGeneralStore, usePostStore, useUserStore } from './stores';
import { handleBeforeUnload, loadSavedData } from './utils';

export default function App() {
  const { user, addUser, setUser, setSave: setUserSave } = useUserStore();
  const { addPost, setSave: setPostSave } = usePostStore();
  const { saveEnabled, setSaveEnabled } = useGeneralStore();

  // ! Retrieve saved data from localStorage
  useEffect(() => {
    loadSavedData({
      addPost,
      addUser,
      setPostSave,
      setSaveEnabled,
      setUser,
      setUserSave,
    });
  }, []);

  const removeBeforeUnload = () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };

  // ! Before Unload
  useEffect(() => {
    if (!saveEnabled) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    } else {
      removeBeforeUnload();
    }

    return removeBeforeUnload;
  }, [saveEnabled]);

  return (
    <div className='h-full'>
      <AppToaster />

      <div className='flex flex-col justify-between h-screen'>
        <div>
          <AppHeader />

          <div className=''>
            {/* Display Pages inside this <Outlet /> */}
            <Outlet />

            {/* Modal for all the pages */}
            {<AppPostLikesModal />}
            {user && <AppWritePostModal />}
            {user && <AppCommentsModal />}
          </div>
        </div>

        <AppFooter />
      </div>
    </div>
  );
}
