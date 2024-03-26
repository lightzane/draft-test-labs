import { LucideEllipsis, LucideIcon } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';

import { cn, kebab } from '../utils';
import { ButtonIcon } from './ui';

type Props = {
  items: MenuItems[];
  triggerTemplate?: ReactNode;
  className?: string;
};

type MenuItems = {
  name: string;
  action: () => void;
  icon?: LucideIcon;
  danger?: boolean;
};

export default function AppMenu(props: Readonly<Props>) {
  const [show, setShow] = useState(false);

  const { items, triggerTemplate, className } = props;

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        window.addEventListener('click', hide);
      });
    }

    return () => {
      window.removeEventListener('click', hide);
    };
  }, [show]);

  const hide = () => {
    setShow(false);
  };

  return (
    <div className='relative'>
      {/* Trigger */}
      {triggerTemplate ? (
        <button
          data-testid='menu-trigger'
          className='outline-none'
          onClick={() => setShow((prev) => !prev)}>
          {triggerTemplate}
        </button>
      ) : (
        <ButtonIcon
          data-testid='menu-trigger'
          onClick={() => setShow((prev) => !prev)}>
          <LucideEllipsis />
        </ButtonIcon>
      )}

      {/* Menu */}
      <div
        className={cn(
          'absolute top-0 right-0',
          'transition-all ease-in-out duration-300',
          { 'opacity-0 -translate-y-1 pointer-events-none': !show },
          { 'opacity-100 translate-y-0': show },
        )}>
        <div
          className={cn(
            'py-1 flex flex-col overflow-hidden',
            'bg-dracula-darker/50 backdrop-blur-md rounded-lg shadow-lg',
            className,
          )}>
          {items.map(({ name, action, danger, icon: Icon }) => (
            <button
              data-testid={`menu-item-${kebab(name)}`}
              key={name}
              className={cn(
                'outline-none',
                'px-5 py-2 flex items-center gap-x-1 text-sm font-semibold',
                { 'hover:bg-dracula-light/10': !danger },
                { 'text-dracula-red hover:bg-dracula-red/10': danger },
              )}
              onClick={(e) => {
                e.stopPropagation();
                action();
                setShow(false);
              }}>
              {Icon && <Icon size={18} />}
              <span>{name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
