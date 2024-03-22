import { useEffect, useState } from 'react';
import { Post, User } from '../../models';
import { usePostStore } from '../../stores';
import AppPosts from './posts';

type Props = {
  user: User;

  /** When true, then display my saved posts instead. Otherwise, display all **MY** posts.  */
  saved?: boolean;
};

export default function AppUserPosts(props: Readonly<Props>) {
  const { user, saved } = props;
  const { posts } = usePostStore();

  const [display, setDisplay] = useState<Post[]>([]);

  useEffect(() => {
    if (user && posts.length) {
      const list: Post[] = [];

      // Display user's saved post
      if (saved) {
        const staging = user.savedPosts.map((id) => {
          const found = posts.find((p) => p.id === id);

          if (found) {
            return found;
          }

          // Notify user of missing posts
          const missingPost = new Post({
            userId: '',
            content: `${id} is missing`,
          });

          missingPost.id = id;
          missingPost.deleted = true;

          return missingPost;
        });

        list.push(...staging);
      }

      // Display my posts instead
      else {
        list.push(...posts.filter((p) => p.userId === user.id));
      }

      setDisplay(list);
    } else {
      setDisplay([]);
    }
  }, [posts, user]);

  return (
    <div className='mx-auto w-full max-w-xl px-4 overflow-x-hidden'>
      <div className='bg-dracula-dark/30 rounded-xl md:p-5'>
        <AppPosts posts={display} />
      </div>
    </div>
  );
}
