import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';

type Props = {
  onClose: () => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  save: () => void;
};

export const Header = ({ onClose, undo, redo, reset, save }: Props) => {
  return (
    <AppBar sx={{ position: 'relative' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
          Draw
        </Typography>
        <Button variant="outlined" sx={{ marginRight: 1 }} size="small" onClick={undo}>
          Undo
        </Button>
        <Button variant="outlined" sx={{ marginRight: 1 }} size="small" onClick={redo}>
          Redo
        </Button>
        <Button variant="outlined" color="warning" sx={{ marginRight: 1 }} size="small" onClick={reset}>
          Reset
        </Button>
        <Button autoFocus color="inherit" onClick={save}>
          save
        </Button>
      </Toolbar>
    </AppBar>
  );
};
