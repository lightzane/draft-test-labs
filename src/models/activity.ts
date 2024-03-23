import { ts, uuid } from '../utils';

export class Activity {
  id = uuid();
  username = '';
  action = '';
  createdTs = ts();

  static POST_CREATE = 'created a post';
  static POST_UPDATE = 'updated a post';
  static POST_DELETE = 'deleted a post';
  static POST_SAVE = 'bookmarked a post';
  static POST_UNSAVE = 'removed a bookmark';
  static POST_LIKE = 'liked a post';
  static POST_UNLIKE = 'unliked a post';
  static COMMENT_CREATE = 'commented on a post';
  static COMMENT_REPLY = 'replied to a comment';
  static COMMENT_LIKE = 'liked a comment';
  static COMMENT_UNLIKE = 'unliked a comment';
  static COMMENT_UPDATE = 'edited a comment';
  static COMMENT_DELETE = 'deleted a comment';
  static COMMENT_RESTORE = 'restored a comment';

  constructor(username: string, action: string) {
    this.username = username;
    this.action = action;
  }
}
