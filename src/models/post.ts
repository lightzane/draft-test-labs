import { z } from 'zod';

import { MUST_NOT_BE_EMPTY } from '../constants';
import { autoFill, ts, uuid } from '../utils';
import { Comment } from '.';

export class Post implements PostInput {
  id = uuid();

  userId!: string;
  content!: string;

  createdTs = ts();
  updatedTs = this.createdTs;

  /** List of userIds who liked this post */
  likes: string[] = [];

  comments: Comment[] = [];

  /** When true, indicates that the content has been changed since it was posted */
  edited = false;

  deleted = false;

  constructor(private props: PostInput) {
    autoFill(this, this.props);

    // Create instances of Comment class
    if (this.comments.length) {
      this.comments = this.comments.map((c) => new Comment(c));

      // Create instance of Comment class (reply)
      this.comments.forEach((comment) => {
        if (comment.replies.length) {
          comment.replies = comment.replies.map((c) => new Comment(c));
        }
      });
    }
  }

  /** When true, means the user liked it. */
  like(userId: string): boolean {
    // like
    if (!this.likes.includes(userId)) {
      this.likes.push(userId);
      return true;
    }

    // unlike
    this.likes = this.likes.filter((l) => l !== userId);
    return false;
  }

  addComment(userId: string, content: string): Comment {
    this.updatedTs = ts();

    const comment = new Comment({
      postId: this.id,
      userId,
      content,
    });

    this.comments.unshift(comment);

    return comment;
  }
}

export const POST_CONTENT_MAX_LEN = 300;

export const PostSchema = z.object({
  userId: z.string().trim().min(1, MUST_NOT_BE_EMPTY),
  content: z
    .string()
    .trim()
    .min(1, MUST_NOT_BE_EMPTY)
    .max(POST_CONTENT_MAX_LEN),
  // imageUrl: z.union([z.string().trim().url(), z.literal('')]),
});

export type PostInput = z.infer<typeof PostSchema>;
