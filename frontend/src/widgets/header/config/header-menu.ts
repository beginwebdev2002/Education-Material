import { MenuItem } from '@shared/models';

export const HEADER_MENU_ITEMS: MenuItem[] = [
  { id: 1, label: 'header.nav.home', path: '/', exact: true },
  { id: 2, label: 'header.nav.materials', path: '/materials' },
  { id: 3, label: 'header.nav.dashboard', path: '/dashboard', requiresAuth: true },
];
