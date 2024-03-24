import { create } from 'zustand';

import { StoragePrefixKey } from '../constants';
import { Post } from '../models';
import { LocalStorageUtil, sortedArray, ts } from '../utils';

type PostState = {
  /** List of posts by all users */
  posts: Post[];
  /** A list of userIds who liked the post. These ids will be displayed on a modal */
  postLikes: Post['likes'];
  /** Last post timestamp, just to detect the change that a new post was triggered */
  lastPostTs: number;
  /**
   * Event-trigger, to show in the `add-post.tsx`
   * Specify the following values:
   * - `post.id` - for editing a post
   * - `null` - for a new post
   */
  editPostId: string | null;
  /** Contains the `post.id` as the target on viewing comments (modal) */
  viewComments: string | null;
  /** Specify comment.id of [`parent` and `child`] in which to open and view its replies */
  viewRepliesOf: [string, string];

  /** Add a post */
  addPost: (post: Post) => void;
  /** Update a post */
  updatePost: (post: Post) => void;
  /** Permanently remove the post */
  deletePost: (id: string) => void;
  /** Set list of userIds who liked a post -- to be displayed in the modal */
  setPostLikes: (postLikes: Post['likes']) => void;
  /** Set the `post.id` to be edited. via `add-post.tsx` */
  setEditPostId: (id: string | null) => void;
  /** Set the target `post.id` to view comments */
  setViewComments: (postId: string | null) => void;
  /** Set the comment id of the target [`parent`, `child`] comment in which to open view its replies */
  setViewRepliesOf: (commentId: [string, string]) => void;
  /** Delete all posts */
  deleteAll: () => void;

  // Environment variables
  /** Enable save to localStorage @default false */
  save: boolean;
  setSave: (save: boolean) => void;
};

export const usePostStore = create<PostState>()((set) => ({
  save: false, // see App.tsx
  posts: [],
  postLikes: [],
  lastPostTs: 0,
  editPostId: null,
  viewComments: null,
  viewRepliesOf: ['', ''],
  setSave: (save) => set({ save }),
  addPost: (post) => {
    set((state) => {
      const posts = [...state.posts];
      const existing = posts.find((p) => p.id === post.id);

      // prevent duplicate
      if (!existing) {
        posts.unshift(new Post(post));
      }

      savePost(state, post);

      let lastPostTs = +ts();

      // Ignore changes within 1 second since last post
      if (state.lastPostTs + 1 >= lastPostTs) {
        lastPostTs = state.lastPostTs;
      }

      return {
        posts: sortedArray(posts, 'updatedTs'),
        lastPostTs,
      }; // why this syntax? Get "sonarlint" extension in vscode and try to use common syntax to sort
    });
  },
  updatePost(post) {
    set((state) => {
      const { id, content, ...updates } = post;
      const posts = [...state.posts];
      const existing = posts.find((p) => p.id === id);

      //* Use spread instead of mutating the array
      //* This should allow change detection that the posts list has been updated

      if (existing) {
        Object.assign(existing, updates);
        savePost(state, existing);
      }

      return {
        posts: sortedArray(posts, 'updatedTs'),
      };
    });
  },
  deletePost(id) {
    set((state) => {
      const posts = [...state.posts].filter((p) => p.id !== id);
      const existing = state.posts.find((p) => p.id === id);

      if (existing) {
        savePost(state, existing, true); // true -> remove post in localStorage
      }

      return {
        posts: sortedArray(posts, 'updatedTs'),
      };
    });
  },
  setPostLikes(postLikes) {
    set(() => ({ postLikes }));
  },
  setEditPostId: (editPostId) => set({ editPostId }),
  setViewComments: (viewComments) => set({ viewComments }),
  setViewRepliesOf: (viewRepliesOf) => set({ viewRepliesOf }),
  deleteAll: () => set({ posts: [] }),
}));

const savePost = (state: PostState, post: Post, remove = false) => {
  if (remove) {
    LocalStorageUtil.remove(StoragePrefixKey.POST(), post);
    return;
  }

  LocalStorageUtil.save(StoragePrefixKey.POST(), state.save, post);
};
