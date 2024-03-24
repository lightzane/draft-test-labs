import { StoragePrefixKey } from '../constants';
import { Post, User } from '../models';

type Config = {
  setUserSave: (b: boolean) => void;
  setPostSave: (b: boolean) => void;
  setSaveEnabled: (b: boolean) => void;
  addUser: (o: User) => void;
  setUser: (o: User) => void;
  addPost: (o: Post) => void;
};

export const loadSavedData = (config: Config) => {
  const localStorage = window.localStorage;

  const {
    setUserSave,
    setPostSave,
    setSaveEnabled,
    addUser,
    setUser,
    addPost,
  } = config;

  if (!localStorage.getItem('save')) {
    setUserSave(false);
    setPostSave(false);
    localStorage.clear(); // delete all localStorage data
    setSaveEnabled(false);
    return;
  } else {
    setUserSave(true);
    setPostSave(true);
    setSaveEnabled(true);
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
};
