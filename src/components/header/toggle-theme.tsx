import { ColorModeContext } from '@config/color-mode-context';
import { Theme } from '@enums';
import DarkModeSharpIcon from '@mui/icons-material/DarkModeSharp';
import WbSunnySharpIcon from '@mui/icons-material/WbSunnySharp';
import { IconButton, useTheme } from '@mui/material';
import { useContext } from 'react';

export const ToggleTheme = () => {
  const { palette } = useTheme();
  const colorMode = useContext(ColorModeContext);
  const Icon = palette.mode === Theme.DARK ? DarkModeSharpIcon : WbSunnySharpIcon;

  return (
    <IconButton onClick={colorMode.toggleColorMode}>
      <Icon />
    </IconButton>
  );
};
