import { PaletteMode, ThemeOptions } from '@mui/material';
import { dark } from './dark';
import { light } from './light';

export const getTheme = (mode: PaletteMode): ThemeOptions => {
  const theme = mode === 'light' ? light : dark;
  return {
    palette: {
      mode,
      ...theme,
      // primary: {
      //   main: theme.colors.blue.primary,
      //   light: theme.colors.blue.secondary,
      //   dark: theme.colors.blue.dark,
      // },
      // background: {
      //   default: theme.colors.background.primary,
      //   paper: theme.colors.background.secondary,
      // },
    },
  };
};
