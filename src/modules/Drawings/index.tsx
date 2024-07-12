import { templates } from '@constant';
import { Box, ButtonBase, Grid, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Plus } from '@phosphor-icons/react';
import { Template } from '@types';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CanvasDialog } from './components/CanvasDialog';

const newTemplate: Template = {
  _id: uuidv4(),
  title: 'Untitled',
  elements: [],
};

export const DrawingsModule = () => {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(newTemplate);

  const handleClickOpen = (template?: Template) => {
    setOpen(true);
    if (template) setSelectedTemplate(template);
    else setSelectedTemplate(newTemplate);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box sx={{ margin: 2 }}>
      <Typography paddingX={1} display="block" variant="h6" marginBottom={1}>
        Start a new sketch
      </Typography>
      <Grid container gap={4}>
        <Grid item sm={6} md={2}>
          <Box>
            <ButtonBase
              onClick={() => handleClickOpen()}
              sx={{
                width: '100%',
                height: 200,
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
        </Grid>
        {templates.map((template) => (
          <Grid key={template._id} item sm={6} md={2}>
            <Box>
              <ButtonBase
                onClick={() => handleClickOpen(template as Template)}
                sx={{
                  width: '100%',
                  height: 200,
                  bgcolor: 'whitesmoke',
                  borderRadius: 1,
                  border: 0.5,
                  borderColor: grey[300],
                }}
              >
                <img src={template.img} style={{ width: '100%', height: 'auto' }} alt="" />
                {/* <Plus weight="bold" size={44} color="#405D72" /> */}
              </ButtonBase>

              <Typography paddingX={1} display="block" marginTop={1} fontSize={14} fontWeight={500}>
                {template.title}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <CanvasDialog open={open} onClose={handleClose} template={selectedTemplate} />
    </Box>
  );
};
