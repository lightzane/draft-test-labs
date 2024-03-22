import { z } from 'zod';
import { MUST_NOT_BE_EMPTY } from '../constants';
import { autoFill, ts, uuid } from '../utils';

export class Comment implements CommentInput {
  id = uuid();

  postId!: string;
  userId!: string;
  content!: string;

  createdTs = ts();
  updatedTs = this.createdTs;

  /** List of userIds who liked this comment */
  likes: string[] = [];

  replies: Comment[] = [];

  /** When true, indicates that the content has been changed since it was commented */
  edited = false;

  deleted = false;

  constructor(private props: CommentInput) {
    autoFill(this, this.props);
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

  delete(): void {
    this.deleted = true;
  }

  /**
   * @param userId The user writing the reply
   * @returns The reply comment
   */
  addReply(userId: string, content: string): Comment {
    const comment = new Comment({
      postId: this.postId,
      userId,
      content,
    });

    this.replies.push(comment);

    return comment;
  }
}

export const CommentSchema = z.object({
  postId: z.string().trim().min(1),
  userId: z.string().trim().min(1),
  content: z.string().trim().min(1, MUST_NOT_BE_EMPTY).max(100),
});

export type CommentInput = z.infer<typeof CommentSchema>;
