import { zodResolver } from '@hookform/resolvers/zod';
import { LucideEraser, LucidePencilLine } from 'lucide-react';
import { forwardRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { POST_EXAMPLES } from '../../constants';
import {
  Activity,
  POST_CONTENT_MAX_LEN,
  Post,
  PostInput,
  PostSchema,
} from '../../models';
import { useActivityStore, usePostStore, useUserStore } from '../../stores';
import { Button, InputTextArea } from '../ui';
import { fetchJoke } from '../../utils';

type Props = {
  className?: string;
  onSubmit?: () => void;
};

const AppAddPostForm = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  const { className } = props;
  const [length, setLength] = useState(POST_CONTENT_MAX_LEN);
  const { user, updateUser } = useUserStore();
  const { posts, addPost, editPostId, updatePost, setEditPostId } =
    usePostStore();
  const { addActivity } = useActivityStore();

  const { register, setValue, formState, handleSubmit, resetField, trigger } =
    useForm<PostInput>({
      resolver: zodResolver(PostSchema),
      mode: 'onChange',
    });

  // ! Set userId
  useEffect(() => {
    if (user) {
      setValue('userId', user.id);
    }
  }, [user]);

  // ! Set default value
  useEffect(() => {
    if (editPostId) {
      if (editPostId === 'new') {
        setEditPostId(null);
        return;
      }

      const post = posts.find((p) => p.id === editPostId);

      if (post) {
        setValue('content', post.content);
        setLength(POST_CONTENT_MAX_LEN - post.content.length);
      }
    } else {
      resetField('content');
    }
  }, [editPostId]);

  const { ref: contentRef, ...contentRest } = register('content');

  const handleShareRef = (e: HTMLTextAreaElement) => {
    contentRef(e); // ref from react-hook-form

    if (ref && typeof ref !== 'function') {
      ref.current = e;
    } else {
      ref?.(e);
    }

    return ref;

    // * Another way of sharing refs:
    /*
        const ref = useRef<HTMLInputElement | null>(null) // * important to have union with null

        <input ref={(e)=>{
            contentRef(e)
            ref.current = e // * the "current" prop will be readonly if we missed to have union with null
        }} />

        ----
        Reference:
        Shared refs with the react-hook-form (https://www.react-hook-form.com/faqs/#Howtosharerefusage)
    */
  };

  const onSubmit = handleSubmit(async (data) => {
    let toastId = toast.loading('Submitting post...');
    let action = Activity.POST_CREATE;

    // * Add mode
    if (!editPostId) {
      // Is this a joke?
      const isJoke = !!(/^joke$/i.exec(data.content.trim()) || []).length;

      if (isJoke) {
        data.content = await fetchJoke();
      }

      addPost(new Post(data));
    }

    // * Edit mode
    else {
      action = Activity.POST_UPDATE;

      const post = posts.find((p) => p.id === editPostId);

      if (!post) {
        return;
      }

      // These will immediately mutate the state even before calling updatePost()
      post.content = data.content;
      post.edited = true;

      updatePost(post); // updates the localStorage as well
    }

    toast.success(editPostId ? 'Post updated' : 'Posted successfully!', {
      id: toastId,
    });

    // reset
    resetField('content');
    setLength(POST_CONTENT_MAX_LEN);
    setEditPostId(null);

    if (user) {
      updateUser(user); // auto-updates the lastActivity
      addActivity(user.username, action);
    }

    props.onSubmit?.(); // ? Why this syntax?
    // -> onSubmit() is an optional prop
    // -> this is the shorthand syntax of the following:
    //
    //  if (!!props.onSubmit) {
    //      props.onSubmit()
    //  }
    //
  });

  const handleExampleClick = () => {
    const POST_EXAMPLE = POST_EXAMPLES();
    setValue('content', POST_EXAMPLE);
    trigger('content'); // triggers validation (to enable submit button, etc)
    setLength(POST_CONTENT_MAX_LEN - POST_EXAMPLE.length);
  };

  const handleClear = () => {
    setLength(POST_CONTENT_MAX_LEN);
    resetField('content');
  };

  return (
    <form className='px-4 sm:px-6 lg:px-8' onSubmit={onSubmit}>
      <div className='py-5 flex flex-col gap-y-5 relative'>
        <InputTextArea
          id='post-content'
          ref={handleShareRef}
          {...contentRest}
          className={className}
          label=''
          placeholder={POST_EXAMPLES(0)}
          errors={formState.errors.content?.message}
          hint={`${length} characters left`}
          onKeyUp={(e) => {
            setLength(POST_CONTENT_MAX_LEN - e.currentTarget.value.length);
          }}
        />
        <div className='absolute bottom-6 flex items-center justify-end inset-x-0 pointer-events-none'>
          {length < 300 ? (
            <button
              data-testid='clear'
              type='button'
              className='pointer-events-auto outline-none text-sm font-semibold text-dracula-blue hover:text-dracula-pink hover:drop-shadow-link flex flex-row items-center gap-x-1 transition-all ease-in-out duration-300'
              onClick={handleClear}>
              <LucideEraser size={18} />
              <span>Clear</span>
            </button>
          ) : (
            <button
              data-testid='example'
              type='button'
              className='pointer-events-auto outline-none text-sm font-semibold text-dracula-blue hover:text-dracula-cyan hover:drop-shadow-link flex flex-row items-center gap-x-1 transition-all ease-in-out duration-300'
              onClick={handleExampleClick}>
              <LucidePencilLine size={18} />
              <span>Example</span>
            </button>
          )}
        </div>
      </div>
      <div className='w-full sm:max-w-sm mx-auto'>
        <Button
          data-testid='submit-post'
          type='submit'
          className='w-full'
          primary={formState.isValid && !editPostId}
          secondary={formState.isValid && !!editPostId}
          disabled={
            !formState.isValid || formState.isSubmitting || !formState.isDirty
          }>
          <span>{editPostId ? 'Update post' : 'Submit post'}</span>
        </Button>
      </div>
    </form>
  );
});

export default AppAddPostForm;
