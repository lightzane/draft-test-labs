import { ReactNode, useEffect } from 'react';

import { AppDataManagement } from './components/(welcome)/data-management';
import { AppFeatureCards } from './components/(welcome)/feature-cards';
import { AppHero } from './components/(welcome)/hero';
import AppFooter from './components/app-footer';
import AppToaster from './components/app-toaster';
import AppHeader from './components/header';
import { Button, Container, SectionTitle } from './components/ui';
import { PageRoute } from './constants';
import { useObserver } from './hooks';
import { useGeneralStore, usePostStore, useUserStore } from './stores';
import { loadSavedData } from './utils';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  document.title = PageRoute.WELCOME.title;

  const navigate = useNavigate();

  const { addUser, setUser, setSave: setUserSave } = useUserStore();
  const { addPost, setSave: setPostSave } = usePostStore();
  const { setSaveEnabled } = useGeneralStore();

  const { disconnect, observer } = useObserver({
    threshold: 0.8,
    intersecting(entry) {
      entry.target.classList.add('animate-enter');
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    loadSavedData({
      addPost,
      addUser,
      setPostSave,
      setSaveEnabled,
      setUser,
      setUserSave,
    });

    return () => {
      disconnect();
    };
  }, []);

  return (
    // ? Parallax 1: Define the container [overflow-y-auto, h-[100vh]]
    <div className='overflow-y-auto h-[100vh]'>
      <AppToaster />
      <div className='fixed w-full z-10'>
        <AppHeader />
      </div>
      {/* start content */}
      <div className='bg-dracula-dark'>
        {/* start "pov" */}
        <div
          // ? Parallax 2: Define the `container` child "pov"
          // ? with h-[100vh] overflow-x-hidden and "perspective=10px" (adjust if necessary)
          className='h-[100vh] overflow-x-hidden'
          style={{ perspective: 10 }}>
          {/* start child "translateZ" */}
          <div
            // ? Parallax 3: Define `pov` child "preserve-3d"
            // ? transform-style: preserve-3d --> This positions its child elements to 3D space
            // ? enabling the transform "translateZ"
            // ? min-h-[100vh] is required to apply preserve-3d to ALL child elements
            // In this example, it's only using 1 child element that have translateZ
            className='min-h-[100vh]'
            style={{ transformStyle: 'preserve-3d' }}>
            {
              // ? Parallax 4: Define the objects (child elements of "preserve-3d")
              // ? transform: translateZ(-10px) scale(2)
              // ? Note that the "perspective" we set is 10px
              // ? the translateZ(-10px) means that the distance of this object
              // ? is now 2x further away from "us", so this obj will become smaller
              // ? so now we add scale(2) to bring it to its usual size
              // ? see <AppHero /> to see those translateZ
              // ! If child is using flex, then min-h-[100vh] is required!
              // * Fortunately, it's an adjustable measure, and can be set to min-h-[70vh]
              // * Depending on the scenario where you want to position the next child elements
            }
            <AppHero />

            {/* Objects in normal scroll speed */}
            {/* Start Near */}
            <div className='bg-dracula-darker relative'>
              <div className='absolute sm:hidden inset-x-0 w-full -top-5 flex justify-center'>
                <Button
                  onClick={() => navigate(PageRoute.REGISTER())}
                  className='w-[60%]'
                  rare>
                  Get Started
                </Button>
              </div>
              <Container className='md:px-4 py-10'>
                <div className='flex flex-col gap-y-10 px-2'>
                  {/* Features */}
                  <View>
                    <SectionTitle className='px-5'>Features</SectionTitle>
                    <div className='border-t-[1px] border-t-dracula-pink pb-5'></div>

                    <div className='min-h-[50vh]'>
                      <View>
                        <div className='mx-auto w-full max-w-3xl'>
                          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-10'>
                            <AppFeatureCards observer={observer} />
                          </div>
                        </div>
                      </View>
                    </div>
                  </View>

                  {/* Data Management */}
                  <AppDataManagement observer={observer} />
                </div>
              </Container>

              {/* Footer */}
              <AppFooter />
            </div>
            {/* End Near */}
          </div>
          {/* end child "translateZ" */}
        </div>
        {/* end "pov" */}
      </div>
      {/* end content */}
    </div>
  );
}

const View = ({ children }: { children: ReactNode }) => {
  return <div className='flex flex-col gap-y-5'>{children}</div>;
};
