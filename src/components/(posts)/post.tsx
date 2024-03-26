import {
  LucideBookmark,
  LucideEdit3,
  LucideHeart,
  LucideMessageCircle,
  LucideTrash2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { PageRoute } from '../../constants';
import { Activity, Post, User } from '../../models';
import { useActivityStore, usePostStore, useUserStore } from '../../stores';
import { cn, kebab, metricCount } from '../../utils';
import AppMenu from '../menu';
import AppTimeAgo from '../time-ago';
import { A, ButtonIcon } from '../ui';
import AppUserAvatar from '../user-avatar';

type Props = {
  post: Post;
  author?: User;
  observer?: IntersectionObserver;
};

// * ===================================================================
// *    AppPost
// * ===================================================================

export default function AppPost(props: Readonly<Props>) {
  const { post, author, observer } = props;

  const { user: loggedInUser, updateUser } = useUserStore();
  const {
    posts,
    updatePost,
    setPostLikes,
    setEditPostId,
    deletePost,
    setViewComments,
  } = usePostStore();
  const { addActivity } = useActivityStore();

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commented, setCommented] = useState(false);
  const [replied, setReplied] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');

  /** The DOM element that contains the entire `Post` card */
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

  // ! Check if I liked/saved/commented/replied on this post already
  useEffect(() => {
    if (loggedInUser) {
      const liked = post.likes.includes(loggedInUser.id);
      const saved = loggedInUser.savedPosts.includes(post.id);
      const commented = post.comments.find((c) => c.userId === loggedInUser.id);

      new Promise<boolean>((resolve) => {
        let replied = false;

        for (const comment of post.comments) {
          replied = comment.replies.some((r) => r.userId === loggedInUser.id);
          if (replied) {
            break;
          }
        }

        resolve(replied);
      }).then(setReplied);

      setLiked(liked);
      setSaved(saved);
      setCommented(!!commented);
    }
  }, [loggedInUser, post, post.comments.length]);

  // ! Count comments
  useEffect(() => {
    let count = post.comments.length;

    post.comments.forEach((comment) => {
      count += comment.replies.length;
    });

    setCommentCount(count);
  }, [post.comments]);

  const handleLike = () => {
    if (post.deleted) {
      return;
    }

    if (loggedInUser) {
      const result = post.like(loggedInUser.id);
      updatePost(post);
      setLiked(result);
      if (result) {
        addActivity(loggedInUser.username, Activity.POST_LIKE);
      } else {
        addActivity(loggedInUser.username, Activity.POST_UNLIKE);
      }
    }
  };

  // ! Set post-content to display and identify image url
  useEffect(() => {
    let content = post.content;
    const regex = /(image|img):(https?:\/\/\S+)/i;
    const firstUrl = regex.exec(content) || [];

    // ? String.match() behaves the same way as RegExp.exec() when the regular expression does not include the global flag g.
    // ? While they work the same, RegExp.exec() can be slightly faster than String.match().
    // ? Therefore, it should be preferred for better performance.

    // ? NON_COMPLIANT   'foo'.match(/bar/);
    // ? COMPLIANT       /bar/.exec('foo');

    if (firstUrl[0] && firstUrl[2]) {
      // [0] = full match
      // [1] = matches "image" or "img"
      // [2] = matches the imageUrl
      setImageUrl(firstUrl[2]);
      content = content.replace(firstUrl[0], '').trim();
    }

    setContent(content);

    return () => {
      setImageUrl('');
      setContent('');
    };
  }, [post, posts]);

  const handleShowLikes = () => {
    if (!post.likes.length || post.deleted) {
      return;
    }

    setPostLikes(post.likes);
  };

  const handleSave = () => {
    if (loggedInUser) {
      const result = loggedInUser.toggleSavePost(post.id);
      updateUser(loggedInUser);
      setSaved(result);
      if (result) {
        addActivity(loggedInUser.username, Activity.POST_SAVE);
      } else {
        addActivity(loggedInUser.username, Activity.POST_UNSAVE);
      }
    }
  };

  const handleEdit = () => {
    setEditPostId(post.id);
  };

  const handleDelete = () => {
    if (loggedInUser && post.userId === loggedInUser.id) {
      // Do not delete saved post
      if (loggedInUser.savedPosts.find((id) => post.id === id)) {
        toast.error('Cannot delete saved post');
      } else {
        deletePost(post.id);
        setDeleted(true);
        addActivity(loggedInUser.username, Activity.POST_DELETE);
      }
    }
  };

  const handleShowComments = () => {
    setViewComments(post.id);
  };

  return (
    <div className={'flex flex-col gap-y-1'}>
      {/* Deleted Post */}
      <div
        className={cn(
          'bg-dracula-dark shadow-md rounded-lg max-w-md mx-auto w-full opacity-0 absolute',
          { 'animate-enter relative bg-opacity-40': deleted },
        )}>
        <div className='p-5 text-gray-400' data-testid='post-deleted'>
          Post permanently deleted...
        </div>
      </div>
      {!deleted && (
        <div className='max-w-md mx-auto w-full '>
          {/* Post */}
          <div
            data-testid={`${kebab(author?.username)}-post`}
            ref={ref}
            className={cn(
              'bg-dracula-dark shadow-md rounded-lg flex flex-col opacity-0',
              { 'bg-opacity-40': post.deleted },
            )}>
            <div className='flex flex-row items-center justify-between'>
              {/* Author */}
              {!post.deleted ? (
                <div
                  className='flex items-center gap-x-3 p-2'
                  data-testid={`${kebab(author?.username)}-author`}>
                  <AppUserAvatar user={author} />
                  <div className='flex flex-col items-start'>
                    <A
                      data-testid='author-username'
                      underline={false}
                      href={PageRoute.PROFILE(author?.id)}
                      className='text-sm font-semibold'>
                      {author?.username}
                    </A>
                    <div className='flex items-center gap-x-1'>
                      <AppTimeAgo time={+post.createdTs} />
                      {post.edited && (
                        <span
                          className='text-xs text-gray-500'
                          data-testid='edited'>
                          (Edited)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className='p-2'>
                  <h4
                    className='text-sm line-through font-semibold py-2.5 opacity-40'
                    data-testid='post-deleted-by-author'>
                    Post deleted by author
                  </h4>
                </div>
              )}

              {/* vertical options */}
              {loggedInUser?.id === post.userId && (
                <div className='px-2'>
                  <AppMenu
                    items={[
                      {
                        name: 'Edit',
                        icon: LucideEdit3,
                        action: handleEdit,
                      },
                      {
                        name: 'Delete',
                        icon: LucideTrash2,
                        danger: true,
                        action: handleDelete,
                      },
                    ]}
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div
              className={cn('border-t-[1px] border-t-dracula-pink', {
                'border-dashed opacity-40': post.deleted,
              })}>
              <div className='min-h-32 whitespace-pre-wrap max-h-[90vh] overflow-y-auto'>
                {!post.deleted && (
                  <div className='flex flex-col gap-y-5'>
                    {imageUrl && (
                      <img
                        data-testid='post-image'
                        src={imageUrl}
                        alt={`image_post:${post.id}`}
                        className='max-h-96 object-contain select-none pointer-events-none'
                      />
                    )}
                    <p
                      data-testid='post-content'
                      className={cn({
                        'p-5': !imageUrl,
                        'p-5 pt-0': imageUrl,
                      })}>
                      {content}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Likes and Comments count */}
            {!post.deleted && (
              <div className='mx-auto max-w-md w-full px-4 bg-dracula-blue/30 animate-enter opacity-0'>
                {(!!post.likes.length || !!post.comments.length) && (
                  <div className='p-1 flex items-center gap-x-3'>
                    {!!post.likes.length && (
                      <button
                        data-testid='count-likes'
                        className={cn(
                          'text-xs font-semibold outline-none',
                          'transition-all ease-in-out duration-300',
                          {
                            'hover:drop-shadow-link hover:text-dracula-cyan':
                              post.likes.length,
                          },
                        )}
                        onClick={handleShowLikes}>
                        <span>
                          {metricCount(post.likes.length, 1)} like
                          {post.likes.length > 1 && 's'}
                        </span>
                      </button>
                    )}
                    {!!commentCount && (
                      <button
                        data-testid='count-comments'
                        className={cn(
                          'text-xs font-semibold outline-none',
                          'transition-all ease-in-out duration-300',
                          {
                            'hover:drop-shadow-link hover:text-dracula-cyan':
                              commentCount,
                          },
                        )}
                        onClick={handleShowComments}>
                        <span>
                          {metricCount(commentCount, 1)} comment
                          {commentCount > 1 && 's'}
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {loggedInUser && (
              <div
                className={cn('border-t-[1px] border-t-dracula-blue', {
                  'border-t-dracula-blue/40': post.deleted,
                })}>
                <div className='p-2 px-5 flex flex-row items-center justify-between'>
                  <div className='flex flex-row items-center gap-x-2'>
                    {/* Like */}
                    <ButtonIcon
                      data-testid='post-action-like'
                      onClick={handleLike}
                      disabled={post.deleted}>
                      <LucideHeart
                        fill={liked ? 'currentColor' : 'none'}
                        className={cn(
                          'transition-all ease-in-out duration-1000',
                          {
                            'text-dracula-pink animate-heart': liked,
                          },
                        )}
                      />
                    </ButtonIcon>
                    {/* Comment */}
                    <ButtonIcon
                      data-testid='post-action-comment'
                      onClick={handleShowComments}
                      disabled={post.deleted}>
                      <LucideMessageCircle
                        fill={commented || replied ? 'currentColor' : 'none'}
                        stroke='currentColor'
                        className={cn(
                          'transition-all ease-in-out duration-1000',
                          {
                            'text-dracula-green':
                              commented || post.comments.length || replied,
                          },
                        )}
                      />
                    </ButtonIcon>
                  </div>
                  {/* Save */}
                  <div className=''>
                    <ButtonIcon
                      data-testid='post-action-save'
                      onClick={handleSave}>
                      <LucideBookmark
                        fill={saved ? 'currentColor' : 'none'}
                        className={cn(
                          'transition-all ease-in-out duration-1000',
                          {
                            'text-dracula-orange': saved,
                          },
                        )}
                      />
                    </ButtonIcon>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
