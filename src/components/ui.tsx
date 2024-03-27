import React, { HTMLAttributes, ReactNode, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { cn, kebab, uuid } from '../utils';

type Props = {
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

type InputHintProps = {
  /** Must be unique. Would also be associated with `data-testid` */
  id: string;
  errors?: string | string[] | boolean;
  hint?: string;
};

type InputTextProps = {
  /** Must be unique. Would also be associated with `data-testid` */
  id: string;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  placeholder?: string;
} & InputHintProps &
  React.HTMLAttributes<HTMLInputElement>;

type InputTextAreaProps = {
  label: string;
  placeholder?: string;
} & InputHintProps &
  React.HTMLAttributes<HTMLTextAreaElement>;

type ButtonProps = {
  children: ReactNode;
  type?: 'button' | 'submit';
  primary?: boolean;
  secondary?: boolean;
  rare?: boolean;
  danger?: boolean;
  disabled?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

type LinkProps = {
  href: string;
  children: ReactNode;
  className?: string;

  /** When true, disable drop shadow (glow) on hover @default false */
  dim?: boolean;

  /** Remove the pink underline @default true */
  underline?: boolean;

  onClick?: () => void;

  /**
   * When true, uses the common `<a>` instead of React Router `<Link>`
   * Use `<Link>` only when inside the RouterProvider of React router
   * @default false
   */
  native?: boolean;
  /** Add target='_blank' for native */
  _blank?: boolean;
} & React.RefAttributes<HTMLAnchorElement>;

/**
 * ```ts
 * 'mx-auto max-w-7xl sm:px-4 md:px-6 lg:px-8 py-5'
 *```
 */
export const Container = (props: Props) => {
  return (
    // prettier-ignore
    <div className={cn('mx-auto max-w-7xl sm:px-4 md:px-6 lg:px-8 py-5', props.className)}>
        {props.children}
    </div>
  );
};

/**
 * ```ts
 * 'animate-enter'
 * ```
 */
export const PageContainer = (props: Props) => {
  return (
    // prettier-ignore
    <div className='animate-enter'>
      {props.children}
    </div>
  );
};

const InputHint = (props: InputHintProps) => {
  const { errors, hint, id } = props;

  return (
    <div className='flex flex-col gap-y-2'>
      {/* Hint */}
      {!errors && hint && (
        <span
          className='text-sm leading-6 text-gray-400 ... animate-enter'
          data-testid={`hint-${kebab(id)}`}>
          {hint}
        </span>
      )}

      {/* Single Error */}
      {!!errors && typeof errors === 'string' && (
        <span
          className='text-dracula-red text-sm leading-6 font-semibold ... animate-enter'
          data-testid={`error-${kebab(id)}`}>
          {errors}
        </span>
      )}

      {/* Multiple Error */}
      {!!errors && Array.isArray(errors) && !!errors.length && (
        <div className='flex flex-col text-sm mt-2 gap-y-2 text-dracula-red font-semibold ... animate-enter'>
          {errors.map((err) => (
            <span key={uuid()} data-testid={`error-${kebab(id)}`}>
              {err}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export const InputText = forwardRef(
  (props: InputTextProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const {
      errors,
      label,
      type,
      placeholder,
      hint,
      required,
      className,
      id,
      ...rest
    } = props;

    return (
      <div className='w-full'>
        <div className='flex flex-col gap-y-2'>
          <label htmlFor={id} className='flex items-center gap-x-1'>
            <span>{label}</span>
            {required && <span className='text-lg text-dracula-red'>*</span>}
          </label>
          <input
            id={kebab(id)}
            name={kebab(id)}
            data-testid={kebab(id)}
            ref={ref}
            {...rest}
            type={type ?? 'text'}
            placeholder={placeholder ?? label}
            className={cn(
              'bg-dracula-blue/10 ring-1 ring-inset ring-dracula-blue border-none outline-none focus:ring-2 focus:ring-inset focus:ring-dracula-purple rounded-lg',
              'transition-all ease-in-out duration-300',
              {
                'ring-2 !ring-dracula-red':
                  (Array.isArray(errors) && errors?.length) ||
                  (typeof errors === 'string' && !!errors),
              },
              className,
            )}
          />

          <InputHint id={id} errors={errors} hint={hint} />
        </div>
      </div>
    );
  },
);

export const InputTextArea = forwardRef(
  (props: InputTextAreaProps, ref: React.ForwardedRef<HTMLTextAreaElement>) => {
    const { errors, label, placeholder, hint, className, id, ...rest } = props;

    return (
      <div className='w-full'>
        <div className='flex flex-col gap-2'>
          <label htmlFor={id} className='text-sm'>
            {label}
          </label>
          <textarea
            id={kebab(id)}
            name={kebab(id)}
            data-testid={kebab(id)}
            ref={ref}
            placeholder={placeholder ?? label}
            {...rest}
            className={cn(
              'bg-dracula-blue/10 ring-1 ring-inset ring-dracula-blue',
              'rounded-lg border-0 outline-none placeholder:text-dracula-light/50',
              'focus:ring-2 focus:ring-inset focus:ring-dracula-purple leading-6',
              'transition-all ease-in-out duration-300',
              'h-[35vh]',
              className,
              'resize-none',
            )}></textarea>
          <InputHint id={id} errors={errors} hint={hint} />
        </div>
      </div>
    );
  },
);

export const Button = (props: ButtonProps) => {
  const {
    children,
    className,
    primary,
    secondary,
    rare,
    danger,
    type,
    disabled,
    ...rest
  } = props;

  return (
    <button
      {...rest}
      disabled={disabled}
      type={type ?? 'button'}
      className={cn(
        'outline-none select-none text-sm font-semibold rounded-lg py-2 px-4 bg-dracula-blue text-dracula-light shadow-sm',
        {
          'bg-dracula-purple text-black focus:ring-dracula-purple': primary,
          'bg-dracula-pink text-black focus:ring-dracula-pink': secondary,
          'bg-dracula-cyan text-black focus:ring-dracula-cyan': rare,
          'bg-dracula-red focus:ring-dracula-red': danger,
        },
        'focus:ring-2 focus:ring-offset-2 focus:ring-offset-dracula-darker',
        'transition-all ease-in-out duration-300',
        { 'hover:opacity-90': !disabled },
        { 'hover:drop-shadow-primary': !disabled && primary },
        { 'hover:drop-shadow-secondary': !disabled && secondary },
        { 'hover:drop-shadow-rare': !disabled && rare },
        { 'hover:drop-shadow-danger': !disabled && danger },
        {
          'cursor-not-allowed bg-dracula-dark opacity-50 text-dracula-light':
            disabled,
        },
        className, // custom from parent
      )}>
      {props.children}
    </button>
  );
};

export const ButtonIcon = (props: ButtonProps) => {
  const { children, className, type, disabled, ...rest } = props;

  return (
    <button
      {...rest}
      disabled={disabled}
      type={type ?? 'button'}
      className={cn(
        { 'hover:bg-dracula-light/20': !disabled },
        'rounded-full p-2 outline-none',
        'transition-all ease-in-out duration-300',
        'disabled:text-gray-400/40',
        className,
      )}>
      {children}
    </button>
  );
};

export const A = (props: LinkProps) => {
  const {
    children,
    className,
    href,
    native,
    _blank,
    dim,
    underline,
    onClick,
    ...rest
  } = props;

  const cls = cn(
    'group no-underline outline-none',
    'flex flex-col items-center gap-y-1',
    'hover:text-dracula-cyan',
    'transition-all ease-in-out duration-300',
    { 'hover:drop-shadow-link': !dim },
  );

  const Content = () => {
    return (
      <>
        <div className={className}>{children}</div>
        {!!underline ||
          (underline === undefined && (
            <div
              className={cn(
                'mx-auto border-b-[1px] border-b-dracula-pink',
                'w-0 group-hover:w-full',
                'transition-all ease-in-out duration-300',
              )}></div>
          ))}
      </>
    );
  };

  return (
    <>
      {native ? (
        <a
          href={href}
          {...rest}
          className={cls}
          onClick={() => onClick?.()}
          target={_blank ? '_blank' : undefined}>
          <Content />
        </a>
      ) : (
        <Link to={href} {...rest} className={cls} onClick={() => onClick?.()}>
          <Content />
        </Link>
      )}
    </>
  );
};

/**
 * ```ts
 * 'text-xl'
 * ```
 */
export const SectionTitle = (props: Props) => {
  return (
    // prettier-ignore
    <h2 className={cn('text-xl', props.className)}>
      {props.children}
    </h2>
  );
};
