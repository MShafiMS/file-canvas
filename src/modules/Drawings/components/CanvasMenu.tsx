import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DownloadSimple, FilePdf, Image, List, PencilSimple, Trash, Users } from '@phosphor-icons/react';
import { useStores } from '@stores';
import { MouseEvent, useState } from 'react';

type Props = {
  saveAsImage: () => void;
  reset: () => void;
  handleSave: (title?: string) => Promise<void>;
};

export const CanvasMenu = ({ saveAsImage, reset, handleSave }: Props) => {
  const { sketchStore } = useStores();
  const { selectedSketch } = sketchStore;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openForm, setOpenForm] = useState(false);
  const [formType, setFormType] = useState<'rename' | 'save' | null>(null);
  const [title, setTitle] = useState(selectedSketch?.title || '');
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSketchSave = async () => {
    await handleSave(title.trim() || 'Untitled');
    setOpenForm(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton size="large" sx={{ position: 'absolute', zIndex: 10, top: 2, left: 2 }} onClick={handleClick}>
        <List color="black" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          sx: {
            overflow: 'visible',
            bgcolor: 'primary.dark',
            color: 'primary.light',
            borderRadius: 1,
          },
        }}
      >
        <MenuItem
          dense
          onClick={() => {
            setOpenForm(true);
            setFormType('save');
          }}
        >
          <DownloadSimple size={20} style={{ marginRight: 12 }} />
          Save to...
        </MenuItem>
        <MenuItem
          dense
          onClick={() => {
            setOpenForm(true);
            setFormType('rename');
          }}
        >
          <PencilSimple size={20} style={{ marginRight: 12 }} />
          Rename
        </MenuItem>
        <MenuItem dense onClick={saveAsImage}>
          <Image size={20} style={{ marginRight: 12 }} />
          Export as image
        </MenuItem>
        <MenuItem dense onClick={handleClose}>
          <FilePdf size={20} style={{ marginRight: 12 }} />
          Export as PDF
        </MenuItem>
        <MenuItem dense onClick={handleClose}>
          <Users size={20} style={{ marginRight: 12 }} />
          Live collaboration
        </MenuItem>
        <MenuItem dense onClick={reset}>
          <Trash size={20} style={{ marginRight: 12 }} />
          Reset the canvas
        </MenuItem>
      </Menu>
      <Dialog open={openForm} onClose={() => setOpenForm(false)} PaperProps={{ sx: { bgcolor: 'background.default' } }}>
        <DialogTitle>{formType === 'rename' ? 'Rename' : 'Save'}</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter sketch name here.</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Sketch Name"
            type="text"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button disabled={selectedSketch?.isLoading} onClick={handleSketchSave} type="submit">
            {selectedSketch?.isLoading ? 'Saving' : formType === 'rename' ? 'Rename' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
