import { useEffect } from 'react';

import { usePageObserver } from '../../hooks';
import { Post } from '../../models';
import { usePostStore, useUserStore } from '../../stores';
import AppPost from './post';

type Props = {
  posts: Post[];
};

export default function AppPosts(props: Readonly<Props>) {
  const { posts } = props;
  const { users } = useUserStore();
  const { lastPostTs } = usePostStore();

  const { observer, view, setView } = usePageObserver(posts, {
    intersecting(entry) {
      entry.target.classList.toggle('animate-enter', entry.isIntersecting);
    },
  });

  // ! New post
  useEffect(() => {
    if (lastPostTs) {
      const latest = posts[0];
      if (latest) {
        // Makes sure that the latest post is added at the top
        setView((prev) => {
          prev = [...prev].filter((p) => p.id !== latest.id);
          return [latest, ...prev];
        });
      }
    }
  }, [lastPostTs]);

  return (
    <div className='flex flex-col gap-y-5'>
      {!posts.length && !view.length ? (
        <div className='py-5 sm:py-0 px-4 md:px-6 lg:px-8'>
          <div className='flex flex-col gap-y-1 items-center justify-center py-10'>
            <h2 className='text-xl font-bold'>No posts yet</h2>
            <p className='text-gray-400'>Start writing now</p>
          </div>
        </div>
      ) : (
        <>
          {view.map((post) => (
            <AppPost
              key={post.id}
              post={post}
              author={users.find((u) => u.id === post.userId)}
              observer={observer}
            />
          ))}
        </>
      )}
    </div>
  );
}
