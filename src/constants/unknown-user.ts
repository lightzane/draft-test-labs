import { User, UserInput } from '../models';

export const UNKNOWN_USER: User = new User({
  firstname: 'User',
  lastname: 'Unknown',
  username: '[unknown user]',
  password: '**',
  deleted: true,
} as UserInput);
