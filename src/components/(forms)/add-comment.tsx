import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';

import { LucideArrowUp, LucideX } from 'lucide-react';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

import {
  Activity,
  Comment,
  CommentInput,
  CommentSchema,
  Post,
  User,
} from '../../models';
import { useActivityStore, usePostStore } from '../../stores';
import { cn, ts } from '../../utils';
import { InputText } from '../ui';
import AppUserAvatar from '../user-avatar';

type Props = {
  /** The user adding a comment */
  user: User;
  post: Post;
  replyTo?: {
    user?: User | null;
    comment?: Comment | null;
  };
  onRemoveReply: () => void;
  onSubmit: () => void;
};

export default function AppAddCommentForm(props: Readonly<Props>) {
  const { user, post, replyTo } = props;

  const { updatePost, setViewRepliesOf } = usePostStore();
  const { addActivity } = useActivityStore();

  const { register, handleSubmit, resetField } = useForm<CommentInput>({
    resolver: zodResolver(CommentSchema),
    values: {
      postId: post.id,
      userId: user.id,
      content: '',
    },
  });

  const { ref, ...rest } = register('content');
  const commentRef = useRef<HTMLInputElement | null>(null);

  const onValid: SubmitHandler<CommentInput> = ({ content }) => {
    const replyToComment = replyTo?.comment;

    // ! Reply
    if (replyToComment) {
      const reply = replyToComment.addReply(user.id, content);

      const idx = post.comments.findIndex((c) => c.id === replyToComment.id);

      if (idx >= 0) {
        post.updatedTs = ts();
        post.comments = [...post.comments];

        setViewRepliesOf([replyToComment.id, reply.id]);
        updatePost(post);
        resetField('content');
        props.onRemoveReply();
        props.onSubmit();

        // activity
        addActivity(user.username, Activity.COMMENT_REPLY);
      }
    }

    // ! New Comment
    else {
      // addComment() will automatically updates post.updatedTs
      post.addComment(user.id, content);
      post.comments = [...post.comments]; // spread to create new instance and not mutate existing - in order to detect changes
      updatePost(post);
      resetField('content');
      props.onSubmit();

      // activity
      addActivity(user.username, Activity.COMMENT_CREATE);
    }
  };

  const onInvalid: SubmitErrorHandler<CommentInput> = (error) => {
    const msg = error.content?.message;

    if (msg) {
      toast.error(
        (t) => <button onClick={() => toast.dismiss(t.id)}>{msg}</button>,
        { position: 'bottom-center' },
      );
    }
  };

  // ! Focus on input when replying
  useEffect(() => {
    if (replyTo) {
      commentRef.current?.focus();
    }
  }, [replyTo]);

  return (
    <div>
      {/* Reply to... */}
      <button
        data-testid='reply-remove'
        onClick={props.onRemoveReply}
        className={cn('group bg-dracula-purple/30 opacity-0 w-full block', {
          'animate-enter': replyTo?.comment && replyTo?.user,
        })}>
        <div className='px-4 md:px-6 lg:px-8 flex flex-row items-center py-1.5 gap-x-2'>
          <div className='rounded-full bg-dracula-red sm:bg-dracula-red/50 group-hover:bg-dracula-red transition ease-in-out duration-300'>
            <div className='flex items-center justify-center'>
              <LucideX size={14} className='p-0.5' strokeWidth={3.5} />
            </div>
          </div>
          <span className='text-xs'>
            <span data-testid='replying'>Replying to </span>
            <span className='font-semibold' data-testid='replying-to'>
              {replyTo?.user?.username.toLowerCase() ===
              user.username.toLowerCase()
                ? 'self'
                : replyTo?.user?.username ?? '...'}
            </span>
          </span>
        </div>
      </button>
      <div className='px-4 md:px-6 lg:px-8'>
        <div
          className='flex flex-row items-center gap-x-3'
          data-testid='add-comment-avatar'>
          <AppUserAvatar user={user} />
          <form
            className='flex-1 flex items-center gap-x-3'
            onSubmit={handleSubmit(onValid, onInvalid)}>
            <InputText
              id='comment'
              className='sm:text-sm'
              ref={(e) => {
                ref(e);
                e?.focus();
                commentRef.current = e;
              }}
              {...rest}
              label=''
              placeholder='Add comment'
            />
            <button
              data-testid='submit-comment'
              type='submit'
              className='rounded-full bg-dracula-cyan text-black p-1.5'>
              <LucideArrowUp size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
