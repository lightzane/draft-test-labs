import { useEffect, useRef, useState } from 'react';

type Props = {
  onHide: () => void;
};

/**
 * Easily configure your modal, so that it will disable scroll on body when modal is open.
 * And when the overlay is clicked, the modal will close.
 *
 * ```tsx
 * const { register, showModal, setShowModal } = useModal({
 *   onHide() {
 *     setEditPostId(null);
 *   },
 * });
 *
 * <div className='pointer-events-none relative z-10'>
 *
 *     <div
 *         {...register()}
 *         className={cn(
 *           'fixed inset-0 flex items-end justify-center cursor-pointer',
 *           'transition ease-in-out duration-500',
 *           {
 *             'pointer-events-auto bg-dracula-light/10': showModal,
 *           },
 *        )}></div>
 *
 *     <div className='fixed inset-0 flex items-end justify-center'>
 *        <div className={cn({ 'pointer-events-auto': showModal })}>
 *          Content here
 *        </div>
 *     </div>
 *
 * </div>
 * ```
 */
export const useModal = (props: Readonly<Props>) => {
  const { onHide } = props;

  const [showModal, setShowModal] = useState(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);

  const hide = () => {
    setShowModal(false);
    onHide();
  };

  const register = () => ({
    ref: (ref: HTMLDivElement | null): void => {
      if (ref) {
        overlayRef.current = ref;
      }
    },
  });

  // ! Add click event on modal div
  useEffect(() => {
    if (showModal) {
      overlayRef.current?.addEventListener('click', hide);
    }

    return () => {
      overlayRef.current?.removeEventListener('click', hide);
    };
  }, [overlayRef, showModal]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      onHide();
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  return {
    register,
    setShowModal,
    showModal,
  };
};
