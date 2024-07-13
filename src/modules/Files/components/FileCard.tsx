import {
  Avatar,
  CardHeader,
  Dialog,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { DotsThreeVertical, Image, ImageBroken } from '@phosphor-icons/react';
import { IFileModel } from '@stores';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

interface IProps {
  view: 'Grid' | 'List';
  file: IFileModel;
}

export const FileCard = observer(({ view, file }: IProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)} style={{ cursor: 'pointer' }}>
        {view === 'List' ? (
          <ListItem>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar>
                  <ImageBroken />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={file.name} secondary="Jan 9, 2014" />
              <IconButton aria-label="settings">
                <DotsThreeVertical weight="bold" />
              </IconButton>
            </ListItemButton>
          </ListItem>
        ) : (
          <Card
            sx={{
              width: '100%',
              bgcolor: 'divider',
              borderRadius: 3,
              paddingBottom: 1,
            }}
          >
            <CardHeader
              avatar={<Image size={20} color="#EA4335" weight="fill" />}
              action={
                <IconButton size="small" aria-label="settings">
                  <DotsThreeVertical weight="bold" />
                </IconButton>
              }
              sx={{ paddingY: 1.5 }}
              subheader={file.name.slice(0, 20)}
            />
            <CardMedia
              component="img"
              image={file.downloadUrl}
              sx={{ marginBottom: 1, height: 140, objectFit: 'cover', objectPosition: 'center' }}
            />
            <Typography sx={{ paddingX: 2 }} variant="caption" color="text.secondary">
              You edited • 11:57 PM
            </Typography>
          </Card>
        )}
      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <CardMedia component="img" image={file.downloadUrl} alt={file.name} height="100%" sx={{ marginBottom: 1 }} />
      </Dialog>
    </>
  );
});
