import { useEffect, useState } from 'react';
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { LucideKeyRound } from 'lucide-react';
import AppUpdatePasswordForm from '../../../../components/(forms)/update-password';
import AppUpdateProfileForm from '../../../../components/(forms)/update-profile';
import AppUserPosts from '../../../../components/(posts)/user-posts';
import AppCounters from '../../../../components/counters';
import {
  Button,
  Container,
  PageContainer,
  SectionTitle,
} from '../../../../components/ui';
import AppUserAvatar from '../../../../components/user-avatar';
import { PageRoute } from '../../../../constants';
import { useLogout } from '../../../../hooks';
import { User } from '../../../../models';
import { useUserStore } from '../../../../stores';
import { cn, kebab, uuid } from '../../../../utils';

const TABS = ['profile', 'posts', 'saved'] as const; // Use 'as const' to infer a readonly tuple

type Tab = (typeof TABS)[number]; // This creates a union type 'Tab' containing 'profile' | 'posts'

export default function ProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { users, user } = useUserStore();
  const { handleLogout, setLoggedInUser } = useLogout();
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState<User>();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Register user to logout
  useEffect(() => {
    setLoggedInUser(user);
  }, [user]);

  // Set profile to displayed
  useEffect(() => {
    const existing = users.find((u) => u.id === id);
    if (existing) {
      document.title = PageRoute.PROFILE.title(existing.firstname);
      setProfile(existing);
    }
  }, [users, id]);

  // Set tab to be displayed
  useEffect(() => {
    let tab = searchParams.get('tab') as Tab;

    // * User owner - enable redirect to profile edit section
    if (user?.id === profile?.id) {
      setActiveTab(tab || 'profile');
    }

    // ! Different user - redirect to posts/saved tab section
    else if (profile && user?.id !== profile.id) {
      tab = 'posts';
      setActiveTab(tab);
      handleProfileTab(tab);
    }
  }, [searchParams, user, profile]);

  const handleProfileTab = (tab: Tab) => {
    if (!id) {
      return;
    }

    navigate(
      {
        pathname: PageRoute.PROFILE(id),
        search:
          tab === 'profile'
            ? undefined
            : createSearchParams({
                tab,
              }).toString(),
      },
      {
        replace: true,
      },
    );
  };

  /**
   * ! Display PROFILE tab only if the user is the actual owner
   */
  const userProfileTab = (tabValue: Tab) => {
    if (!user || !profile) {
      return false;
    }

    if (tabValue !== 'posts') {
      if (user.id === profile.id) {
        return true;
      }

      return false;
    }

    return true;
  };

  return (
    <Container className='pt-10'>
      <PageContainer>
        {!profile ? (
          <div className='px-4' data-testid='user-not-found'>
            User not found
          </div>
        ) : (
          <div className='mx-auto max-w-3xl flex flex-col gap-y-5 animate-enter'>
            {/* Hero */}
            <div className='px-4 grid grid-cols-1 sm:grid-cols-3 gap-1 gap-y-5'>
              <div
                className='flex items-center justify-center'
                data-testid='profile-hero-avatar'>
                <AppUserAvatar user={profile} size={150} />
              </div>

              <div className='col-span-2 flex flex-col'>
                <p className='text-dracula-cyan' data-testid='username'>
                  @{profile.username}
                </p>
                <h2
                  className='text-3xl font-bold break-words line-clamp-2 capitalize'
                  data-testid='fullname'>
                  {profile.fullname}
                </h2>
                <p className='text-gray-400' data-testid='description'>
                  {profile.description}
                </p>

                {/* Counts */}
                <div className='pt-3'>
                  <AppCounters user={profile} />
                </div>
              </div>
            </div>

            {/* User nav */}
            {user && (
              <>
                <nav className='border-t-[1px] border-t-dracula-purple px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between'>
                  <div className='flex items-center gap-x-5'>
                    {TABS.filter(userProfileTab).map((tab) => (
                      <div
                        key={uuid()}
                        className='group flex flex-col gap-y-1 cursor-pointer'>
                        <button
                          onClick={() => handleProfileTab(tab)}
                          data-testid={`${kebab(tab)}-tab`}>
                          <span
                            className={cn('text-xs uppercase', {
                              'text-gray-400 hover:text-dracula-light':
                                activeTab !== tab,
                            })}>
                            {tab}
                          </span>
                        </button>
                        <div
                          className={cn(
                            'mx-auto border-b-[1px] border-b-dracula-pink',
                            'transition-all ease-in-out duration-300', // todo why animation not working
                            {
                              'w-full': activeTab === tab,
                              'w-0': activeTab !== tab,
                            },
                          )}></div>
                      </div>
                    ))}
                  </div>
                </nav>

                {/* Profile */}
                {activeTab === 'profile' && (
                  <>
                    <div className='flex items-center justify-end px-4 animate-enter'>
                      <Button
                        danger
                        onClick={handleLogout}
                        data-testid='logout'>
                        Logout
                      </Button>
                    </div>

                    <div className='flex flex-col gap-y-10 animate-enter'>
                      <div className=''>
                        <SectionTitle className='px-4 pb-5 mb-10 border-b-[1px] border-b-dracula-pink'>
                          Basic Information
                        </SectionTitle>
                        <Container className='px-4'>
                          <AppUpdateProfileForm user={user} />
                        </Container>
                      </div>

                      <div className=''>
                        <SectionTitle className='px-4 pb-5 mb-10 border-b-[1px] border-b-dracula-pink'>
                          Passwords and Authentication
                        </SectionTitle>
                        <Container className='px-4'>
                          <AppUpdatePasswordForm user={user} />
                        </Container>
                      </div>
                    </div>
                  </>
                )}

                {/* User's Posts */}
                {activeTab === 'posts' && (
                  // ! adding a key is important for detecting changes
                  // ! in order for the profile data to be reactive on the child
                  // ! when you remove "key" and use back/forward in browser
                  // ! then it will not reflect the data in the child
                  // ! only by adding a "key" will help detecting the change
                  <AppUserPosts key={profile.id + activeTab} user={profile} />
                )}

                {/* Saved Posts */}
                {activeTab === 'saved' && (
                  <AppUserPosts
                    key={profile.id + activeTab} // reactiveness depends on changes on activeTab and profile.id
                    user={profile}
                    saved
                  />
                )}
              </>
            )}

            {/* Not Logged In */}
            {!user && (
              <div className='pt-5 sm:pt-20 flex items-center justify-center'>
                <div className='flex flex-col items-center gap-y-2'>
                  <LucideKeyRound size={30} />
                  <h2 className='text-lg font-bold'>Login Required</h2>
                  <p className='leading-6 text-gray-400'>
                    Please login to view more details
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </PageContainer>
    </Container>
  );
}
