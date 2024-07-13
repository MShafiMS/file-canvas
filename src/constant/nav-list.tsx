import {
  Faders,
  FolderSimple,
  GearSix,
  House,
  PaintBrush,
  Question,
  Slideshow,
  Users,
  Wrench,
} from '@phosphor-icons/react';
import { ReactNode } from 'react';

interface ISidebarMenu {
  label: string;
  route: string;
  icon: ReactNode;
  submenus?: ISidebarMenu[];
  isOpenInNewTab?: boolean;
  opened?: boolean;
}

interface ISidebarNavList {
  subHeader?: string;
  menus: ISidebarMenu[];
}

export const navList: ISidebarNavList[] = [
  {
    menus: [
      {
        label: 'Overview',
        route: '/overview',
        icon: <House weight="fill" />,
        opened: true,
      },
      {
        label: 'Files',
        route: '/files',
        icon: <FolderSimple weight="fill" />,
        opened: true,
      },
    ],
  },
  {
    subHeader: 'Editing',
    menus: [
      {
        label: 'Drawings',
        route: '/drawings',
        icon: <PaintBrush weight="fill" />,
        opened: true,
      },
      {
        label: 'Templates',
        route: '/templates',
        icon: <Slideshow weight="fill" />,
      },
      {
        label: 'Collaborators',
        route: '/collaborators',
        icon: <Users weight="fill" />,
      },
    ],
  },
  {
    subHeader: 'Customization',
    menus: [
      {
        label: 'Settings',
        route: '/settings',
        icon: <GearSix weight="fill" />,
      },
      {
        label: 'Customize UI',
        route: '/customize-ui',
        icon: <Faders weight="fill" />,
      },
    ],
  },
  {
    subHeader: 'Misc',
    menus: [
      {
        label: 'Plugins',
        route: '/plugins',
        icon: <Wrench weight="fill" />,
      },
      {
        label: 'Support',
        route: 'https://ablespace.io',
        icon: <Question weight="fill" />,
      },
    ],
  },
];

export const getRouteLabel = (route: string): string => {
  const menus: ISidebarMenu[] = navList.flatMap((list) => list.menus);
  const menu = menus.find((menu) => menu.route === route);
  return menu ? menu.label : 'Not Found';
};
