import { RouterProvider, createHashRouter } from 'react-router-dom';

import HomePage from './app/pages/home';
import LoginPage from './app/pages/login';
import LogoutPage from './app/pages/logout';
import RegisterPage from './app/pages/register';
import ProfilePage from './app/pages/user/[id]/profile';
import WelcomePage from './welcome';

import App from './App';
import { PageRoute } from './constants';

// ! Github Pages doesn't support BrowserRouter, instead use HashRouter
// Specifically, client routing. It may look working initially
// But when you refresh the page, Github Pages will look for the route in its server
// Then 404 Page Not Found will be thrown in return
const router = createHashRouter([
  {
    path: PageRoute.WELCOME(),
    element: <WelcomePage />,
  },
  {
    path: '/',
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
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
