import { FullScreenLoader } from '@components/core';
import {
  Box,
  ButtonBase,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { File, Plus, Trash } from '@phosphor-icons/react';
import { useStores } from '@stores';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { CanvasDialog } from './components/CanvasDialog';

export const DrawingsModule = observer(() => {
  const [open, setOpen] = useState(false);

  const { sketchStore } = useStores();
  const {
    sketches,
    selectedSketch,
    createSketch,
    setSelectedSketchId,
    templates,
    deleteSketch,
    loadSketches,
    isLoading,
  } = sketchStore;

  const handleClickOpen = (id: string) => {
    setOpen(true);
    setSelectedSketchId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    loadSketches();
  }, []);

  if (isLoading) return <FullScreenLoader />;
  return (
    <Box sx={{ margin: 2 }}>
      <Typography paddingX={1} display="block" variant="h6" marginBottom={1}>
        Start a new sketch
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <ButtonBase
            onClick={() => handleClickOpen(createSketch()._id)}
            sx={{
              width: 140,
              height: 180,
              bgcolor: 'background.default',
              borderRadius: 1,
              border: 0.5,
              borderColor: grey[300],
            }}
          >
            <Plus weight="bold" size={44} />
          </ButtonBase>
          <Typography paddingX={1} display="block" marginTop={1} fontSize={14} fontWeight={500}>
            Blank
          </Typography>
        </Box>
        {templates.map((template) => (
          <Box>
            <ButtonBase
              onClick={() => handleClickOpen(template._id)}
              sx={{
                width: 140,
                height: 180,
                bgcolor: 'whitesmoke',
                borderRadius: 1,
                border: 0.5,
                borderColor: grey[300],
              }}
            >
              {/* <img src={template.img} style={{ width: '100%', height: 'auto' }} alt="" /> */}
              {/* <Plus weight="bold" size={44} color="#405D72" /> */}
            </ButtonBase>

            <Typography paddingX={1} display="block" marginTop={1} fontSize={14} fontWeight={500}>
              {template.title}
            </Typography>
          </Box>
        ))}
      </Box>
      {sketches.length > 0 && (
        <Box sx={{ marginTop: 2 }}>
          <Typography paddingX={1} display="block" variant="h6" marginBottom={1}>
            Drawings
          </Typography>
          <List>
            {sketches.map((sketch) => (
              <ListItem key={sketch._id} disablePadding>
                <ListItemButton onClick={() => handleClickOpen(sketch._id)}>
                  <ListItemIcon>
                    <File />
                  </ListItemIcon>
                  <ListItemText primary={sketch.title} />
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSketch(sketch._id);
                    }}
                  >
                    <Trash />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      {selectedSketch && <CanvasDialog open={open} onClose={handleClose} template={selectedSketch} />}
    </Box>
  );
});
