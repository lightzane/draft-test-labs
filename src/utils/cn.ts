import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 *
 * ```ts
 * import type { ClassValue } from 'clsx';
 * import clsx from 'clsx';
 * import { twMerge } from 'tailwind-merge';
 *
 * export const cn = (...input: ClassValue[]) => {
 *   return twMerge(clsx(input));
 * };
 * ```
 */
export const cn = (...input: ClassValue[]) => {
  return twMerge(clsx(input));
};
