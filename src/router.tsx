import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import HomePage from './app/pages/home';
import LoginPage from './app/pages/login';
import LogoutPage from './app/pages/logout';
import RegisterPage from './app/pages/register';
import ProfilePage from './app/pages/user/[id]/profile';

import App from './App';
import { PageRoute, basename } from './constants';

const router = createBrowserRouter(
  [
    {
      path: PageRoute.HOME(),
      element: <App />,
      children: [
        {
          path: PageRoute.HOME(),
          element: <HomePage />,
        },
        {
          path: PageRoute.REGISTER(),
          element: <RegisterPage />,
        },
        {
          path: PageRoute.LOGIN(),
          element: <LoginPage />,
        },
        {
          path: PageRoute.PROFILE(),
          element: <ProfilePage />,
        },
        {
          path: PageRoute.LOGOUT(),
          element: <LogoutPage />,
        },
      ],
    },
  ],
  {
    basename,
  },
);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
