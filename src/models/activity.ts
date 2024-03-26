import { ts, uuid } from '../utils';

export class Activity {
  id = uuid();
  username = '';
  action = '';
  createdTs = ts();

  static readonly POST_CREATE = 'created a post';
  static readonly POST_UPDATE = 'updated a post';
  static readonly POST_DELETE = 'deleted a post';
  static readonly POST_SAVE = 'bookmarked a post';
  static readonly POST_UNSAVE = 'removed a bookmark';
  static readonly POST_LIKE = 'liked a post';
  static readonly POST_UNLIKE = 'unliked a post';
  static readonly COMMENT_CREATE = 'commented on a post';
  static readonly COMMENT_REPLY = 'replied to a comment';
  static readonly COMMENT_LIKE = 'liked a comment';
  static readonly COMMENT_UNLIKE = 'unliked a comment';
  static readonly COMMENT_UPDATE = 'edited a comment';
  static readonly COMMENT_DELETE = 'deleted a comment';
  static readonly COMMENT_RESTORE = 'restored a comment';

  constructor(username: string, action: string) {
    this.username = username;
    this.action = action;
  }
}
