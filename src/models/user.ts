import { z } from 'zod';

import {
  MUST_BE_ALPHA,
  MUST_BE_ALPHANUMERIC_OR_UNDERSCORE,
  MUST_NOT_BE_EMPTY,
  MUST_NOT_CONTAIN_SPACE,
} from '../constants';
import { autoFill, ts, uuid } from '../utils';
import { Post } from '.';

export class User implements UserInput {
  id = uuid();
  lastActivity = ts();
  description = 'User';

  firstname!: string;
  lastname = '';
  username!: string;
  password!: string;
  fullname!: string;

  savedPosts: Post['id'][] = [];

  deleted = false;

  constructor(private props: UserInput) {
    let { firstname, lastname } = props;

    this.fullname = `${firstname} ${lastname}`.trim();

    autoFill<User>(this, this.props, { ignores: ['fullname'] });
  }

  /**
   * Saves the `post.id` when not exist. Else, remove it from saved list.
   * @returns `true` when saved, else `false`
   */
  toggleSavePost(id: string): boolean {
    if (!this.savedPosts.includes(id)) {
      this.savedPosts.unshift(id);
      return true;
    }

    this.savedPosts = this.savedPosts.filter((savedId) => savedId !== id);
    return false;
  }
}

export const UserSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(1, MUST_NOT_BE_EMPTY)
    .max(30)
    .regex(/^[a-z A-Z]+$/g, MUST_BE_ALPHA),
  lastname: z
    .string()
    .trim()
    .max(30)
    .regex(/^[a-z A-Z]*$/g, MUST_BE_ALPHA)
    .optional(),
  username: z
    .string()
    .trim()
    .min(1, MUST_NOT_BE_EMPTY)
    .max(30)
    .regex(/^\S*$/, MUST_NOT_CONTAIN_SPACE)
    .regex(/^\w+$/g, MUST_BE_ALPHANUMERIC_OR_UNDERSCORE),
  // Non-compliant:   _a-zA-Z0-9
  // Compliant:       \w

  // Non-compliant:   /^[\w]+$/
  // Compliant:       /^\w+$/
  password: z
    .string()
    .regex(/[a-z]/, 'Must contain lowercase character')
    .regex(/[A-Z]/, 'Must contain uppercase character')
    .regex(/\d/, 'Must contain number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain special character')
    .regex(/\s/, 'Must contain space')
    .min(8),
});

export type UserInput = z.infer<typeof UserSchema>;
