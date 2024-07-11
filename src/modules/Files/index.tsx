import { CloudUpload, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  styled,
} from '@mui/material';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch('https://picsum.photos/v2/list', { method: 'GET' }).then((res) => res.json());
      setImageList(response);
    };
    fetchImages();
  }, []);
  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, marginY: 2 }}>
        <Box
          sx={{
            width: '60%',
            display: 'flex',
            bgcolor: 'background.paper',
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
      <Box sx={{ display: 'flex', justifyContent: 'center', marginY: 1 }}>
        <FormControl sx={{ m: 1, minWidth: 80 }}>
          <InputLabel id="demo-simple-select-autowidth-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            // value={age}
            // onChange={handleChange}
            autoWidth
            size="small"
            label="Age"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={21}>Twenty one</MenuItem>
            <MenuItem value={22}>Twenty one and a half</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 80 }}>
          <InputLabel id="demo-simple-select-autowidth-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            // value={age}
            // onChange={handleChange}
            autoWidth
            size="small"
            label="Age"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={21}>Twenty one</MenuItem>
            <MenuItem value={22}>Twenty one and a half</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 80 }}>
          <InputLabel id="demo-simple-select-autowidth-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            // value={age}
            // onChange={handleChange}
            autoWidth
            size="small"
            label="Age"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={21}>Twenty one</MenuItem>
            <MenuItem value={22}>Twenty one and a half</MenuItem>
          </Select>
        </FormControl>
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
