import { Brain, Wand2, Kanban, Users, LucideIcon } from 'lucide-react';

type MenuItemType = {
  title: string;
  url: string;
  external?: string;
  icon?: LucideIcon;
  items?: MenuItemType[];
};
type MenuType = MenuItemType[];

export const mainMenu: MenuType = [
  {
    title: 'AI Dashboard',
    url: '/pages/dashboard',
    icon: Brain,
  },
  {
    title: 'Generate Tasks',
    url: '/pages/taskcreation',
    icon: Wand2,
  },
  {
    title: 'Task Board',
    url: '/pages/taskboard',
    icon: Kanban,
  },
  {
    title: 'Manage Team',
    url: '/pages/manage-team',
    icon: Users,
  },
];
