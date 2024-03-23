import { useEffect } from 'react';

import AppHomeAside from '../../components/home-aside';
import AppPosts from '../../components/(posts)/posts';
import { Container, PageContainer } from '../../components/ui';
import { PageRoute } from '../../constants';
import { usePostStore, useUserStore } from '../../stores';
import AppWritePostTrigger from '../../components/(posts)/write-post-trigger';
import AppRecentActivities from '../../components/recent-activities';
import { createSearchParams, useNavigate } from 'react-router-dom';

export default function HomePage() {
  document.title = PageRoute.HOME.title;

  const { posts, setEditPostId } = usePostStore();
  const { user } = useUserStore();

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!user) {
      const search = createSearchParams({
        redirect: encodeURI(PageRoute.HOME()),
      }).toString();

      navigate({
        pathname: PageRoute.LOGIN(),
        search,
      });
    }
  }, []);

  return (
    <Container className='md:px-4 py-10'>
      <PageContainer>
        <div className='flex justify-center gap-y-5'>
          {/* Important to add align-self: flex-start to a "sticky" element with "flex" parent */}
          <aside className='hidden lg:block sticky self-start w-full max-w-xs top-20'>
            {user && (
              <div className='mx-auto max-w-sm px-4 animate-enter'>
                <AppHomeAside />
              </div>
            )}
          </aside>

          {/* Body Content */}
          <div className='w-full xl:min-w-[36rem] max-w-xl px-4 overflow-x-hidden'>
            <div className='bg-dracula-dark/30 rounded-xl md:p-5'>
              <AppPosts posts={posts} />
            </div>
          </div>

          {/* Right Aside */}
          <aside className='hidden 2xl:block sticky self-start w-full max-w-xs top-20'>
            <div className='mx-auto max-w-sm px-4 animate-enter'>
              <AppRecentActivities />
            </div>
          </aside>
        </div>
      </PageContainer>

      <AppWritePostTrigger onClick={() => setEditPostId('new')} />
    </Container>
  );
}
