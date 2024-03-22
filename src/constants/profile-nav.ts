import {
  LucideBookmark,
  LucideIcon,
  LucideLayers,
  LucideSquareUserRound,
} from 'lucide-react';
import { createSearchParams } from 'react-router-dom';

import { PageRoute } from '.';

type Nav = {
  name: string;
  route: (userId?: string) => string;
  icon: LucideIcon;
  search?: string;
};

export const navs: Nav[] = [
  {
    name: 'Account Profile',
    route: (userId) => PageRoute.PROFILE(userId),
    icon: LucideSquareUserRound,
  },
  {
    name: 'My Posts',
    route: (userId) => PageRoute.PROFILE(userId),
    icon: LucideLayers,
    search: createSearchParams({ tab: 'posts' }).toString(),
  },
  {
    name: 'Saved',
    route: (userId) => PageRoute.PROFILE(userId),
    icon: LucideBookmark,
    search: createSearchParams({ tab: 'saved' }).toString(),
  },
];
