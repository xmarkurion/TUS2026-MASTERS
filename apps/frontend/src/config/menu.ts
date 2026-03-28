import { Brain, Settings, Wand2, LucideIcon } from 'lucide-react';

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
    url: '/',
    icon: Brain,
  },
  {
    title: 'Generate Tasks',
    url: '/pages/taskcreation',
    icon: Wand2,
  },
  {
    title: 'Workspace',
    url: '/workspace',

    items: [
      {
        title: 'Task List',
        url: '/pages/taskslist',
      },
      {
        title: 'Task Board',
        url: '/pages/taskboard',
      },
      {
        title: 'Projects',
        url: '/pages/projects',
      },
      {
        title: 'Manage Team',
        url: '/pages/manage-team',
      },
    ],
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];
