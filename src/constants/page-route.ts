const HOME = () => '/';
HOME.title = 'Test Labs';

const REGISTER = () => '/register';
REGISTER.title = `Register | ${HOME.title}`;

const LOGIN = () => '/login';
LOGIN.title = `Login | ${HOME.title}`;

const PROFILE = (id?: string) => `/user/${id ?? ':id'}/profile`;
PROFILE.title = (name: string) => `${name}'s Profile | ${HOME.title}`;

const LOGOUT = () => '/logout';
LOGOUT.title = `Logout | ${HOME.title}`;

export const PageRoute = {
  HOME,
  REGISTER,
  LOGIN,
  PROFILE,
  LOGOUT,
};
