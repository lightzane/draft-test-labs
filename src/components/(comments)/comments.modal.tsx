import { useEffect, useRef, useState } from 'react';

import AppAddCommentForm from '../(forms)/add-comment';
import { useModal, usePageObserver } from '../../hooks';
import { Comment, Post, User } from '../../models';
import { usePostStore, useUserStore } from '../../stores';
import { cn } from '../../utils';
import AppComment from './comment';
import AppCommentLikes from './comment-likes';

export default function AppCommentsModal() {
  const { user } = useUserStore();
  const { posts, viewComments, setViewComments, setViewRepliesOf } =
    usePostStore();

  const [showLikes, setShowLikes] = useState<[string, string]>(['', '']); // the [comment id, `isReply`] to view its likes
  const [post, setPost] = useState<Post>();
  const [commentToReply, setCommentToReply] = useState<Comment | null>(); // comment to reply
  const [userToReply, setUserToReply] = useState<User | null>(); // user to send a reply

  const { register, setShowModal, showModal } = useModal({
    onHide() {
      setViewComments(null);
      setShowLikes(['', '']);
      setUserToReply(null);
      setCommentToReply(null);
      setViewRepliesOf(['', '']);
    },
  });

  const commentsRef = useRef<HTMLDivElement | null>(null);

  const { observer, setView } = usePageObserver<Comment>([], {
    intersecting(entry) {
      entry.target.classList.toggle('animate-enter', entry.isIntersecting);
    },
  });

  /** Prep the data for replying to a comment (For Submission...) */
  const handleReplyComment = (user: User, comment: Comment) => {
    setUserToReply(user);
    setCommentToReply(comment);
  };

  /** Comment / Reply submitted... */
  const handleCommentSubmit = () => {
    commentsRef.current?.scrollTo(0, 0);
  };

  const handleScrollTo = (ref: HTMLDivElement) => {
    commentsRef.current?.scrollTo({
      top: ref.offsetTop,
      behavior: 'smooth',
    });
  };

  // ! Show modal
  useEffect(() => {
    if (viewComments) {
      setShowModal(true);
    }

    return () => {
      setShowModal(false);
    };
  }, [viewComments]);

  // ! Set post
  useEffect(() => {
    const existing = posts.find((p) => p.id === viewComments);
    setPost(existing);

    if (existing) {
      setView(existing.comments);
    }
  }, [viewComments]);

  return (
    <div className='pointer-events-none relative z-10'>
      {/* Overlay */}
      <div
        data-testid='comment-modal-overlay'
        {...register()}
        className={cn(
          'fixed inset-0 flex items-end justify-center cursor-pointer',
          'transition ease-in-out duration-500',
          {
            'pointer-events-auto bg-dracula-light/10': showModal,
          },
        )}></div>

      <div className='fixed inset-0 flex items-end justify-center'>
        {/* Content */}
        <div
          className={cn(
            'relative overflow-hidden',
            'rounded-t-3xl sm:rounded-t-lg w-full max-w-xl bg-dracula-darker shadow-2xl cursor-default pb-3',
            'transition-all ease-in-out duration-300',
            'flex flex-col gap-y-1',
            {
              'translate-y-0 pointer-events-auto': showModal,
              'translate-y-full': !showModal,
            },
          )}>
          <h3
            data-testid='modal-heading'
            className={cn(
              'text-center font-semibold text-sm py-3 border-b-[1px] border-b-dracula-pink',
            )}>
            <span>Comments</span>
          </h3>

          {/* Comments */}
          <div className=''>
            {!post?.comments.length ? (
              <div className='flex flex-col gap-y-1 pt-10 pb-32 items-center'>
                <p className='text-lg font-bold' data-testid='no-comments-yet'>
                  No comments yet
                </p>
                <span
                  className='text-sm text-gray-400'
                  data-testid='start-the-conversation'>
                  Start the conversation
                </span>
              </div>
            ) : (
              // Comments here
              <div
                ref={commentsRef}
                className='pt-5 flex flex-col gap-y-5 min-h-52 max-h-[50vh] sm:max-h-[70vh] overflow-y-auto'>
                {post.comments.map((comment) => (
                  <AppComment
                    observer={observer}
                    key={comment.id}
                    comment={comment}
                    onShowLikes={(parentCommentId, childCommentId) =>
                      setShowLikes([parentCommentId, childCommentId])
                    }
                    onCloseRequest={() => setShowModal(false)}
                    onReplyComment={handleReplyComment}
                    selectedCommentId={commentToReply?.id}
                    scrollOverMe={handleScrollTo}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Add Comment */}
          {user && post && (
            <AppAddCommentForm
              key={post.id}
              user={user}
              post={post}
              replyTo={{ user: userToReply, comment: commentToReply }}
              onRemoveReply={() => setCommentToReply(null)}
              onSubmit={handleCommentSubmit}
            />
          )}

          {/* Comment likes */}
          {post && (
            <AppCommentLikes
              show={!!showLikes[0]}
              post={post}
              commentId={showLikes[0]}
              replyId={showLikes[1]}
              onCloseLikes={() => setShowLikes(['', ''])}
              onCloseRequest={() => setShowModal(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
