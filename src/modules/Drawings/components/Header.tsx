import { ToggleTheme } from '@components/header';
import { Close } from '@mui/icons-material';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useStores } from '@stores';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

type Props = {
  onClose: () => void;
  title: string;
  showWarn: boolean;
  handleSave: () => Promise<void>;
};

export const Header = observer(({ title, onClose, showWarn, handleSave }: Props) => {
  const { sketchStore } = useStores();
  const { selectedSketch } = sketchStore;
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    if (showWarn) setOpen(true);
    else onClose();
  };

  const handleClose = () => {
    if (selectedSketch?.isLoading) return;
    setOpen(false);
  };

  const saveAndExit = async () => {
    await handleSave();
    handleClose();
    onClose();
  };
  return (
    <AppBar sx={{ position: 'relative' }} color="default">
      <Toolbar>
        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
          {title}
        </Typography>
        <ToggleTheme />
        <Button sx={{ ml: 2 }} variant="outlined" color="secondary" onClick={handleClickOpen}>
          Close
        </Button>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{ sx: { bgcolor: 'background.default' } }}
        >
          <DialogTitle id="alert-dialog-title">{'Discard Sketch?'}</DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <Close />
          </IconButton>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to discard your current sketch? Any unsaved changes will be lost. This action cannot
              be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button disabled={selectedSketch?.isLoading} onClick={saveAndExit} color="info" variant="contained">
              {selectedSketch?.isLoading ? 'Saving' : 'Save And Exit'}
            </Button>
            <Button
              onClick={() => {
                handleClose();
                onClose();
              }}
              color="error"
              variant="contained"
              autoFocus
            >
              Discard
            </Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
});
