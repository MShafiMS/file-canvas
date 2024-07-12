import { CloudUpload, Search } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, InputBase, styled } from '@mui/material';
import { useState } from 'react';
import { FileCard } from './components/FileCard';

interface IImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export const FilesModule = () => {
  const [imageList, setImageList] = useState<IImage[]>([]);

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, marginY: 2 }}>
        <Box
          sx={{
            width: '60%',
            display: 'flex',
            bgcolor: 'divider',
            borderRadius: 2,
          }}
        >
          <InputBase
            sx={{ ml: 2, flex: 1, width: '100%' }}
            placeholder="Search Files"
            inputProps={{ 'aria-label': 'search files' }}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <Search />
          </IconButton>
        </Box>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          color="warning"
          startIcon={<CloudUpload />}
        >
          Upload file
          <VisuallyHiddenInput type="file" />
        </Button>
      </Box>
      <Grid container gap={3} justifyContent="center">
        {imageList.map((image) => (
          <Grid item key={image.id} xl={2} lg={3} md={4} sm={6} xs={12}>
            <FileCard {...image} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
