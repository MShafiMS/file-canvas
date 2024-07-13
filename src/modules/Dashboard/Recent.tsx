import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Title } from './Title';

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export const RecentDrawings = () => {
  return (
    <>
      <Title>Recent Drawings</Title>
      <Typography component="p" variant="h5">
        12 Drawings
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on 15 March, 2024
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View all drawings
        </Link>
      </div>
    </>
  );
};

export const RecentFiles = () => {
  return (
    <>
      <Title>Recent Files</Title>
      <Typography component="p" variant="h5">
        8 Files
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on 15 March, 2024
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View all files
        </Link>
      </div>
    </>
  );
};
