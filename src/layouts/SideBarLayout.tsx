import { AccountMenu, ToggleTheme } from '@components/header';
import { getRouteLabel, navList } from '@constant/nav-list';
import MenuIcon from '@mui/icons-material/Menu';
import { ListSubheader, Typography, useMediaQuery } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { CSSObject, Theme, styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: '0px',
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 2),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  [theme.breakpoints.up('sm')]: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  },
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  [theme.breakpoints.up('sm')]: {
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
  },
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

interface IProps {
  children: ReactNode;
}

export const SidebarLayout = ({ children }: IProps) => {
  const theme = useTheme();
  const isLargeDevice = useMediaQuery(theme.breakpoints.up('sm'));
  const [open, setOpen] = useState(isLargeDevice);
  const { route, push } = useRouter();

  const isSelected = (menuRoute: string): boolean => {
    return route === menuRoute;
  };

  const handleLogout = async () => {
    push('/signin');
  };

  const handleDrawerClick = () => {
    setOpen(!open);
  };

  const DrawerChild = () => {
    return (
      <Box sx={{ height: '100vh', bgcolor: 'background.default' }}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: [1],
          }}
        >
          <DrawerHeader sx={{ display: 'flex', justifyContent: 'start' }}>
            <Link href={'/'}>
              <img src="/images/logo.svg" alt="logo" width={140} />
            </Link>
          </DrawerHeader>
          <IconButton onClick={handleDrawerClick}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        {navList.map((listItem, index) => (
          <List
            key={index}
            component="nav"
            saria-labelledby="nested-list-subheader"
            disablePadding
            subheader={
              listItem.subHeader && (
                <ListSubheader sx={{ bgcolor: 'background.default' }} component="div" id="nested-list-subheader">
                  {listItem.subHeader}
                </ListSubheader>
              )
            }
          >
            {listItem.menus.map((menu) => (
              <Link href={menu.route} key={menu.label} style={{ textDecoration: 'none' }}>
                <ListItem selected={isSelected(menu.route)} disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <menu.icon />
                    </ListItemIcon>
                    <ListItemText primary={menu.label} sx={{ opacity: open ? 1 : 0, color: 'primary.main' }} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open} sx={{ boxShadow: 'none' }} color="default">
        <Toolbar>
          <IconButton
            size="medium"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerClick}
            sx={{
              marginRight: 2,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            {getRouteLabel(route)}
          </Typography>
          <ToggleTheme />
          <AccountMenu />
        </Toolbar>
      </AppBar>
      {/* mobile drawer  */}
      <MuiDrawer
        variant="temporary"
        open={open}
        onClose={handleDrawerClick}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          width: drawerWidth,
        }}
      >
        <DrawerChild />
      </MuiDrawer>
      {/* desktop drawer  */}
      <Drawer variant="permanent" open={open} sx={{ display: { xs: 'none', sm: 'block' } }}>
        <DrawerChild />
      </Drawer>
      <Box
        component="main"
        sx={{
          width: '100%',
          height: '100vh',
          maxHeight: '100vh',
          overflowY: 'auto',
          bgcolor: 'background.default',
          color: 'primary.main',
          marginTop: 8,
        }}
      >
        <DrawerHeader sx={{ display: { xs: 'block', sm: 'none' } }} />
        {children}
      </Box>
    </Box>
  );
};
