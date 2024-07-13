import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Chart } from './Chart';
import { Drawings } from './Drawings';
import { RecentDrawings, RecentFiles } from './Recent';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        File Canvas
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export const DashboardModule = () => {
  return (
    <>
      <Grid sx={{ padding: 2 }} container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 'fit-content',
              bgcolor: 'background.default',
            }}
          >
            <Chart />
          </Paper>
        </Grid>
        {/*  RecentDrawings */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 2,
              bgcolor: 'background.default',
            }}
          >
            <RecentDrawings />
          </Paper>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.default',
            }}
          >
            <RecentFiles />
          </Paper>
        </Grid>
        {/* Recent Drawings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', bgcolor: 'background.default', flexDirection: 'column' }}>
            <Drawings />
          </Paper>
        </Grid>
      </Grid>
      <Copyright sx={{ pt: 4 }} />
    </>
  );
};
