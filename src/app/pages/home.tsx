import { useEffect } from 'react';

import AppHomeAside from '../../components/home-aside';
import AppPosts from '../../components/(posts)/posts';
import { Container, PageContainer } from '../../components/ui';
import { PageRoute } from '../../constants';
import { usePostStore, useUserStore } from '../../stores';
import AppWritePostTrigger from '../../components/(posts)/write-post-trigger';

export default function HomePage() {
  document.title = PageRoute.HOME.title;

  const { posts, setEditPostId } = usePostStore();
  const { user } = useUserStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container className='md:px-4 py-10'>
      <PageContainer>
        <div className='flex gap-y-5'>
          {/* Important to add align-self: flex-start to a "sticky" element with "flex" parent */}
          <aside className='hidden lg:block sticky self-start w-full max-w-xs top-20'>
            {user && (
              <div className='mx-auto max-w-sm px-4 animate-enter'>
                <AppHomeAside />
              </div>
            )}
          </aside>
          <div className='w-full max-w-xl px-4 overflow-x-hidden'>
            <div className='bg-dracula-dark/30 rounded-xl md:p-5'>
              <AppPosts posts={posts} />
            </div>
          </div>
        </div>
      </PageContainer>

      <AppWritePostTrigger onClick={() => setEditPostId('new')} />
    </Container>
  );
}
