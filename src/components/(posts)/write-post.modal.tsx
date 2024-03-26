import { useEffect, useRef } from 'react';

import AppAddPostForm from '../(forms)/add-post';
import { POST_EXAMPLES } from '../../constants';
import { useModal } from '../../hooks';
import { usePostStore } from '../../stores';
import { cn } from '../../utils';

export default function AppWritePostModal() {
  const { editPostId, setEditPostId } = usePostStore();

  const { register, showModal, setShowModal } = useModal({
    onHide() {
      setEditPostId(null);
    },
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFormSubmit = () => {
    setShowModal(false);

    if (!editPostId) {
      window.scrollTo(0, 0);
    }
  };

  // ! Auto focus on text area
  useEffect(() => {
    if (showModal) {
      textareaRef.current?.focus();
      textareaRef.current?.setAttribute('placeholder', POST_EXAMPLES(0));
    }
  }, [showModal]);

  // ! Show form when editing a post
  useEffect(() => {
    if (editPostId) {
      setShowModal(true);
    }
  }, [editPostId]);

  return (
    <div className='pointer-events-none relative z-10'>
      {/* Modal Overlay */}
      <div
        data-testid='write-post-modal-overlay'
        {...register()}
        className={cn(
          'fixed inset-0 flex items-end justify-center cursor-pointer',
          'transition ease-in-out duration-500',
          {
            'pointer-events-auto bg-dracula-light/10': showModal,
          },
        )}></div>

      <div className='fixed inset-0 flex items-end justify-center'>
        {/* Modal content */}
        <div
          className={cn(
            'rounded-t-3xl sm:rounded-t-lg w-full max-w-lg bg-dracula-darker shadow-2xl cursor-default pb-10',
            'transition-all ease-in-out duration-300',
            {
              'translate-y-0 pointer-events-auto': showModal,
              'translate-y-full': !showModal,
            },
          )}>
          <h3
            className={cn(
              'text-center font-semibold text-sm py-3 border-b-[1px]',
              {
                'border-b-dracula-pink': editPostId,
                'border-b-dracula-purple': !editPostId,
              },
            )}>
            <span data-testid='modal-heading'>
              {editPostId ? 'Edit post' : 'Write a post'}
            </span>
          </h3>
          <AppAddPostForm
            ref={textareaRef}
            onSubmit={handleFormSubmit}
            className={cn({ 'focus:ring-dracula-pink': editPostId })}
          />
        </div>
      </div>
    </div>
  );
}
