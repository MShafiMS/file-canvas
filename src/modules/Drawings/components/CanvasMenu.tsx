import { IconButton } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DownloadSimple, FilePdf, Image, List, PencilSimple, Trash, Users } from '@phosphor-icons/react';
import { MouseEvent, useState } from 'react';

type Props = {
  saveAsImage: () => void;
  reset: () => void;
};

export const CanvasMenu = ({ saveAsImage, reset }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
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
        <MenuItem dense onClick={handleClose}>
          <DownloadSimple size={20} style={{ marginRight: 12 }} />
          Save to...
        </MenuItem>
        <MenuItem dense onClick={handleClose}>
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
    </>
  );
};
