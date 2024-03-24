const AppName = 'Test Labs';

const WELCOME = () => '/';
WELCOME.title = `Welcome to ${AppName}`;

const HOME = () => '/home';
HOME.title = AppName;

const REGISTER = () => '/register';
REGISTER.title = `Register | ${AppName}`;

const LOGIN = () => '/login';
LOGIN.title = `Login | ${AppName}`;

const PROFILE = (id?: string) => `/user/${id ?? ':id'}/profile`;
PROFILE.title = (name: string) => `${name}'s Profile | ${AppName}`;

const LOGOUT = () => '/logout';
LOGOUT.title = `Logout | ${AppName}`;

export const PageRoute = {
  WELCOME,
  HOME,
  REGISTER,
  LOGIN,
  PROFILE,
  LOGOUT,
};
