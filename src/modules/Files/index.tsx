import { FullScreenLoader } from '@components/core';
import { FILE } from '@enums';
import { Search } from '@mui/icons-material';
import { Box, Button, ButtonGroup, Grid, IconButton, InputBase, List as MuiList } from '@mui/material';
import { Check, FilePdf, Image, List, SquaresFour } from '@phosphor-icons/react';
import { useStores } from '@stores';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { FileCard } from './components/FileCard';
import { FileUpload } from './components/UploadFile';

export const FilesModule = observer(() => {
  const { fileStore } = useStores();
  const { loadFiles, isLoading, files } = fileStore;
  const [view, setView] = useState<'Grid' | 'List'>('Grid');
  const [type, setType] = useState<FILE>(FILE.IMG);
  const [searchKey, setSearchKey] = useState('');

  const fileList = useMemo(() => {
    return files
      .slice()
      .reverse()
      .filter((file) => file.fileType === type && file.name.trim().includes(searchKey.trim()));
  }, [type, searchKey, files]);

  useEffect(() => {
    loadFiles();
  }, []);

  if (isLoading) return <FullScreenLoader />;
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
            value={searchKey}
            onChange={(e) => setSearchKey(e.currentTarget.value)}
            inputProps={{ 'aria-label': 'search files' }}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <Search />
          </IconButton>
        </Box>
        <FileUpload />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, marginX: 4 }}>
        <ButtonGroup color="inherit" size="small" variant="outlined" aria-label="Basic button group">
          <Button onClick={() => setType(FILE.IMG)} sx={type === FILE.IMG ? { bgcolor: 'divider', gap: 1 } : {}}>
            {type === FILE.IMG ? <Check weight="bold" size={18} /> : <Image weight="bold" size={18} />} Image
          </Button>
          <Button onClick={() => setType(FILE.PDF)} sx={type === FILE.PDF ? { bgcolor: 'divider', gap: 1 } : {}}>
            {type === FILE.PDF ? <Check weight="bold" size={18} /> : <FilePdf weight="bold" size={18} />} PDF
          </Button>
        </ButtonGroup>

        <ButtonGroup color="inherit" variant="outlined" aria-label="Basic button group">
          <Button onClick={() => setView('List')} sx={view === 'List' ? { bgcolor: 'divider', gap: 1 } : {}}>
            {view === 'List' && <Check weight="bold" size={18} />}
            <List weight="bold" size={18} />
          </Button>
          <Button onClick={() => setView('Grid')} sx={view === 'Grid' ? { bgcolor: 'divider', gap: 1 } : {}}>
            {view === 'Grid' && <Check weight="bold" size={18} />}
            <SquaresFour weight="bold" size={18} />
          </Button>
        </ButtonGroup>
      </Box>
      {view === 'Grid' ? (
        <Grid container gap={4} justifyContent="center">
          {fileList.map((file) => (
            <Grid item key={file._id} xl={2} lg={3} md={4} sm={6} xs={12}>
              <FileCard file={file} view={view} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <MuiList sx={{ width: '100%' }}>
          {fileList.map((file) => (
            <FileCard key={file._id} file={file} view={view} />
          ))}
        </MuiList>
      )}
    </div>
  );
});
