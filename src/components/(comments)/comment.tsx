import { LucideCornerDownRight, LucideHeart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { PageRoute, UNKNOWN_USER } from '../../constants';
import { Activity, Comment, User } from '../../models';
import { useActivityStore, usePostStore, useUserStore } from '../../stores';
import { cn, metricCount, ts } from '../../utils';
import AppTimeAgo from '../time-ago';
import { A, ButtonIcon } from '../ui';
import AppUserAvatar from '../user-avatar';

type Props = {
  comment: Comment;
  onShowLikes: (parentCommentId: string, childCommentId: string) => void;
  onCloseRequest: () => void;
  /**
   * Send data on replying to a comment.
   * @param user Replying to user....
   * @param comment The parent or child comment. If child comment, then add the replies to parent comment instead.
   */
  onReplyComment: (user: User, comment: Comment) => void;
  /** For identifying which "reply" button to highlight */
  selectedCommentId?: string;
  /** On reply, this ref is submitted so that the modal parent can scroll into the reply / child comment */
  scrollOverMe: (childCommentRef: HTMLDivElement) => void;

  observer?: IntersectionObserver;
  /** When true, indicates that this comment is a child/reply of another parent comment */
  isChildComment?: boolean;
  parentComment?: Comment;
};

export default function AppComment(props: Readonly<Props>) {
  const {
    comment,
    observer,
    selectedCommentId,
    isChildComment,
    parentComment,
  } = props;
  const { posts, updatePost, viewRepliesOf } = usePostStore();
  const { users, user: loggedInUser } = useUserStore();
  const { addActivity } = useActivityStore();

  const [like, setLike] = useState(false);
  const [commentBy, setCommentBy] = useState<User>(UNKNOWN_USER);
  const [viewReplies, setViewReplies] = useState(false); // works only on parentComment

  const handleLikeComment = () => {
    if (loggedInUser) {
      const result = comment.like(loggedInUser.id);
      setLike((prev) => !prev);
      pushPostUpdates();

      if (result) {
        addActivity(loggedInUser.username, Activity.COMMENT_LIKE);
      } else {
        addActivity(loggedInUser.username, Activity.COMMENT_UNLIKE);
      }
    }
  };

  const handleDeleteComment = () => {
    if (!loggedInUser || loggedInUser.id !== comment.userId) {
      return;
    }

    comment.delete();
    pushPostUpdates();

    addActivity(loggedInUser.username, Activity.COMMENT_DELETE);
  };

  const handleReplyComment = (comment: Comment) => {
    if (loggedInUser) {
      /** Reply to user */
      const user = users.find((u) => u.id === comment.userId);

      if (isChildComment && parentComment) {
        comment = parentComment;
      }

      if (user) {
        props.onReplyComment(user, comment);
      }
    }
  };

  const handleUndoDelete = () => {
    if (comment.userId === loggedInUser?.id) {
      comment.deleted = false;
      pushPostUpdates();
      addActivity(loggedInUser.username, Activity.COMMENT_RESTORE);
    }
  };

  const pushPostUpdates = (updateTs = false) => {
    const post = posts.find((p) => p.id === comment.postId);

    if (post) {
      if (updateTs) {
        post.updatedTs = ts();
      }
      updatePost(post);
    }
  };

  const ref = useRef<HTMLDivElement>(null);

  // ! Observe this element
  useEffect(() => {
    if (ref?.current && observer) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref?.current && observer) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, observer]);

  // ! Identify comment owner
  useEffect(() => {
    const user = users.find((u) => u.id === comment.userId);

    if (user) {
      setCommentBy(user);
    }
  }, [users, comment]);

  // ! Identify if logged in user liked the comment
  useEffect(() => {
    if (loggedInUser) {
      // Identify if user liked the comment
      setLike(comment.likes.includes(loggedInUser.id));
    } else {
      setLike(false);
    }
  }, [loggedInUser, comment]);

  // ! Watch for replies and automatically view and expand the replies + scroll into view
  useEffect(() => {
    const [parentId, childId] = viewRepliesOf;

    if (!isChildComment && parentId === comment.id) {
      setViewReplies(parentId === comment.id);
    }

    // Child comment
    if (isChildComment && ref.current && childId === comment.id) {
      props.scrollOverMe(ref.current);
    }
  }, [viewRepliesOf]);

  return (
    <div
      data-testid={`${commentBy.username}-comment${
        isChildComment ? '-reply' : ''
      }`}
      id={comment.id}
      ref={ref}
      className={cn({
        'opacity-0 p-1 px-4 md:px-6 lg:px-8': !isChildComment,
        'ml-4 pl-5 py-3 border-l-[1px] border-l-dracula-blue': isChildComment,
        'animate-enter-delay opacity-0':
          isChildComment && viewRepliesOf?.[1] === comment.id,
      })}>
      <div className='flex items-start gap-x-3'>
        {/* Profile */}
        <div className='flex items-center gap-x-1' data-testid='comment-avatar'>
          <AppUserAvatar user={commentBy} size={isChildComment ? 30 : 35} />
        </div>
        {/* Body */}
        <div className='flex flex-col flex-1'>
          {/* Comment author */}
          <div className='flex items-center gap-x-1'>
            {commentBy.deleted ? (
              <span
                className='text-xs text-gray-400 line-through'
                data-testid='comment-author'>
                {commentBy.username}
              </span>
            ) : (
              <A
                underline={false}
                href={PageRoute.PROFILE(commentBy.id)}
                className='text-xs font-semibold text-gray-300 hover:text-dracula-cyan'
                onClick={() => props.onCloseRequest()}>
                <span data-testid='comment-author'>{commentBy.username}</span>
              </A>
            )}
            <AppTimeAgo key={comment.id} time={+comment.createdTs} />
          </div>
          {/* Comment content */}
          {comment.deleted ? (
            <div
              className='text-gray-500 pt-1 line-through italic text-sm sm:text-xs leading-6'
              data-testid='comment-deleted'>
              This comment has been deleted
            </div>
          ) : (
            <div className='text-sm leading-6' data-testid='comment-content'>
              {comment.content}
            </div>
          )}
          {/* Comment actions */}
          <div className='pt-2 flex flex-row gap-x-5 text-sm sm:text-xs font-semibold text-gray-500'>
            {!comment.deleted && (
              <>
                <button
                  data-testid='comment-action-reply'
                  className={cn(
                    'outline-none hover:drop-shadow-link hover:text-dracula-green',
                    {
                      'text-dracula-green': comment.id === selectedCommentId,
                    },
                  )}
                  onClick={() => handleReplyComment(comment)}>
                  <span>Reply</span>
                </button>

                {comment.userId === loggedInUser?.id && (
                  <button
                    data-testid='comment-action-delete'
                    className='outline-none hover:drop-shadow-link hover:text-dracula-red'
                    onClick={handleDeleteComment}>
                    <span>Delete</span>
                  </button>
                )}
              </>
            )}

            {comment.deleted && comment.userId === loggedInUser?.id && (
              <button
                data-testid='comment-action-undo'
                className='outline-none hover:drop-shadow-link hover:text-dracula-green'
                onClick={handleUndoDelete}>
                <span>Undo</span>
              </button>
            )}
          </div>
        </div>
        {/* Like Comment */}
        {!comment.deleted && (
          <div className='flex flex-col items-center'>
            <ButtonIcon
              onClick={handleLikeComment}
              data-testid='comment-action-like'>
              <LucideHeart
                size={18}
                fill={like ? 'currentColor' : 'none'}
                className={cn({ 'text-dracula-pink': like })}
              />
            </ButtonIcon>
            <button
              data-testid='comment-likes-count'
              className={cn('text-sm sm:text-xs font-semibold outline-none', {
                'pointer-events-none opacity-0': !comment.likes.length,
              })}
              onClick={() => {
                const parent = parentComment ? parentComment.id : comment.id;
                const child = isChildComment ? comment.id : '';

                props.onShowLikes(parent, child);
              }}>
              {metricCount(comment.likes.length, 1)}
            </button>
          </div>
        )}
      </div>

      {/* Comment Replies */}
      {!!comment.replies.length && (
        <div className={cn({ 'pt-5': viewReplies })}>
          {viewReplies || comment.replies.length < 5 ? (
            <>
              {comment.replies.map((reply) => (
                <AppComment
                  isChildComment
                  key={reply.id}
                  parentComment={comment}
                  comment={reply}
                  onCloseRequest={props.onCloseRequest}
                  onReplyComment={props.onReplyComment}
                  onShowLikes={props.onShowLikes}
                  selectedCommentId={selectedCommentId}
                  scrollOverMe={props.scrollOverMe}
                  // observer={observer} // ! TODO issue since the root is still based on <body />
                />
              ))}
            </>
          ) : (
            <div className='pl-5 pt-3'>
              <button
                className='text-xs font-semibold hover:drop-shadow-link text-dracula-blue hover:text-dracula-green flex items-center gap-x-1'
                onClick={() => setViewReplies(true)}>
                <LucideCornerDownRight size={18} />
                <span className='pt-1'>
                  View all {metricCount(comment.replies.length, 1)} repl
                  {comment.replies.length > 1 ? 'ies' : 'y'}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
