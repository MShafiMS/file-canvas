import {
  ContactSupport,
  Dashboard,
  Draw,
  Extension,
  Folder,
  Groups,
  Settings,
  Tune,
  ViewCarousel,
} from '@mui/icons-material';

interface ISidebarMenu {
  label: string;
  route: string;
  icon: any;
  submenus?: ISidebarMenu[];
  isOpenInNewTab?: boolean;
}

interface ISidebarNavList {
  subHeader?: string;
  menus: ISidebarMenu[];
}

export const navList: ISidebarNavList[] = [
  {
    menus: [
      {
        label: 'Dashboard',
        route: '/dashboard',
        icon: Dashboard,
      },
      {
        label: 'Files',
        route: '/files',
        icon: Folder,
      },
      {
        label: 'Canvas',
        route: '/canvas',
        icon: Draw,
      },
    ],
  },
  {
    subHeader: 'Editing',
    menus: [
      {
        label: 'Collaborators',
        route: '/collaborators',
        icon: Groups,
      },
      {
        label: 'Templates',
        route: '/templates',
        icon: ViewCarousel,
      },
    ],
  },
  {
    subHeader: 'Customization',
    menus: [
      {
        label: 'Settings',
        route: '/settings',
        icon: Settings,
      },
      {
        label: 'Customize UI',
        route: '/customize-ui',
        icon: Tune,
      },
    ],
  },
  {
    subHeader: 'Misc',
    menus: [
      {
        label: 'Plugins',
        route: '/plugins',
        icon: Extension,
      },
      {
        label: 'Support',
        route: 'https://ablespace.io',
        icon: ContactSupport,
      },
    ],
  },
];

export const getRouteLabel = (route: string): string => {
  const menus: ISidebarMenu[] = navList.flatMap((list) => list.menus);
  const menu = menus.find((menu) => menu.route === route);
  return menu ? menu.label : 'Not Found';
};
