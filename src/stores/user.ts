import { create } from 'zustand';

import { User } from '../models';
import { LocalStorageUtil, sortedArray, ts } from '../utils';
import { StoragePrefixKey } from '../constants';

type UserState = {
  /** List of users */
  users: User[];
  /** Logged in user */
  user: User | null;
  /** Add new user */
  addUser: (user: User) => void;
  /** Update a user */
  updateUser: (user: Partial<User>) => void;
  /** Set the logged-in user, and updates lastActivity. @param login when false, then logout (default **true**) */
  setUser: (user: User, login?: boolean) => void;
  /** Delete all users */
  deleteAll: () => void;

  // Environment variables
  /** Enable save to localStorage @default false */
  save: boolean;
  setSave: (save: boolean) => void;
};

export const useUserStore = create<UserState>()((set) => ({
  save: false, // see App.tsx
  setSave: (save) => set({ save }),
  users: [],
  user: null,
  addUser: (user) =>
    set((state) => {
      const users = [...state.users];
      const existing = users.find((u) => u.id === user.id);

      // prevent duplicate
      if (!existing) {
        users.push(new User(user));
      }

      saveUser(state, user);
      return {
        users: sortedArray(users, 'lastActivity'),
      }; // see sorted-array.ts
    }),
  updateUser: (user) => {
    set((state) => {
      const users = [...state.users];
      const { id, ...updates } = user;
      const existing = users.find((u) => u.id === id);

      if (existing) {
        updates.fullname = `${updates.firstname} ${updates.lastname}`.trim();
        updates.lastActivity = ts();
        Object.assign(existing, updates);
        saveUser(state, existing);

        if (state.user) {
          state.setUser(existing); // update user session
        }
      }

      return { users: sortedArray(users, 'lastActivity') };
    });
  },
  setUser: (user, login = true) => {
    set((state) => {
      const users = [...state.users];

      if (user) {
        const existing = users.find((u) => u.id === user.id);

        if (existing) {
          if (login) {
            existing.lastActivity = ts();
            saveUser(state, existing);
            saveUserLogin(state, existing);
            user = new User(user); // set User instance to implement OOP features
          } else {
            saveUserLogin(state, existing, false); // logout
            return { users, user: null };
          }
        }
      }

      return { users, user };
    });
  },
  deleteAll: () => set({ users: [] }),
}));

/** Save to `localStorage` with key equal to `u-<user.id>` */
const saveUser = (state: UserState, user: User) => {
  LocalStorageUtil.save(StoragePrefixKey.USER(), state.save, user);
};

/**
 * Save to `localStorage` with key equal to `u-<user.id>`
 * @param login When false, remove the key from localStorage. (Default is **true**)
 */
const saveUserLogin = (state: UserState, user: User, login = true) => {
  const key = StoragePrefixKey.LOGGED_IN_USER();

  if (login) {
    LocalStorageUtil.save(key, state.save, user);
  } else {
    LocalStorageUtil.remove(key, user);
  }
};
