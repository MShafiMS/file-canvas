import { CloudUpload } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Box, ImageList, ImageListItem, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { Upload } from '@phosphor-icons/react';
import { useStores } from '@stores';
import { observer } from 'mobx-react-lite';
import { ChangeEvent, useState } from 'react';

const FILE_MIME_TYPE = 'image/png, image/gif, image/jpeg, image/svg+xml, application/pdf';

export const FileUpload = observer(() => {
  const { fileStore } = useStores();
  const { uploadFiles, uploading } = fileStore;
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList?.length) {
      const newFiles = Array.from(fileList);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (idx: number) => {
    const newFiles = files.filter((file, i) => i !== idx);
    setFiles(newFiles);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setFiles([]);
    setOpen(false);
  };

  const handleUpload = async () => {
    if (files.length) {
      await uploadFiles(files);
      setFiles([]);
      handleClose();
    }
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        color="info"
        size="small"
      >
        <CloudUpload fontSize="small" />
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        PaperProps={{
          sx: { bgcolor: 'background.default' },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Upload Files
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box minWidth={400}>
            <label
              htmlFor="upload-files"
              style={{
                width: '100%',
                cursor: 'pointer',
                borderRadius: '8px',
                borderStyle: 'dashed',
                borderColor: 'rgba(0, 0, 0, 0.4)',
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: '2px',
                padding: '24px',
              }}
            >
              <Upload />
              <Typography
                style={{
                  fontWeight: 500,
                  fontSize: '14px',
                }}
              >
                Drag and Drop files here or <span style={{ textDecoration: 'underline' }}>Choose files</span>
              </Typography>
              <Typography
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  opacity: 0.7,
                }}
              >
                Supported formats: JPG, PNG, GIF, SVG, PDF
              </Typography>
            </label>
            <input
              type="file"
              id="upload-files"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              multiple
              accept={FILE_MIME_TYPE}
            />
            <Typography
              style={{
                textAlign: 'end',
                padding: '4px',
                color: 'rgba(0, 0, 0, 0.8)',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              Maximum Size: 32 MB
            </Typography>
          </Box>
          <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
            {files.map((file, idx) => (
              <ImageListItem key={idx}>
                <IconButton
                  aria-label="close"
                  size="small"
                  color="error"
                  onClick={() => removeFile(idx)}
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <img
                  srcSet={`${URL.createObjectURL(file)}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  src={
                    file.type === 'application/pdf'
                      ? 'https://www.svgrepo.com/show/66745/pdf.svg'
                      : URL.createObjectURL(file)
                  }
                  alt={file.name}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
