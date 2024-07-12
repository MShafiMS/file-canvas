import { Backdrop, CircularProgress } from '@mui/material';

export const FullScreenLoader = () => {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: 100 }} open>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
