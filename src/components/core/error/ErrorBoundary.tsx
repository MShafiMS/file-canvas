import { Box, Button, Link, Typography } from '@mui/material';
import { Warning } from '@phosphor-icons/react';
import { ErrorBoundary as NextErrorBoundary } from 'next/dist/client/components/error-boundary';
import { ReactNode } from 'react';

// const resetAppState = () => {
//   window.location.reload();
// };

type ErrorComponentPropr = {
  error: Error;
  reset: () => void;
};

type Props = {
  children: ReactNode;
};

export const ErrorBoundary = ({ children }: Props) => {
  return <NextErrorBoundary errorComponent={ErrorComponent}>{children}</NextErrorBoundary>;
};

const ErrorComponent = ({ error, reset }: ErrorComponentPropr) => {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}
    >
      <Warning size={80} weight="light" color="#EFBC5B" />
      <Typography display="block" variant="h5">
        {error.message}
      </Typography>
      <Typography marginBottom={2} display="block" variant="subtitle1">
        Try refreshing the page and if it doesn&#39;t solve the issue, please email us at{' '}
        <Link href="mailto:dev.muhammadshafi@gmail.com" className="text-blue-500">
          dev.muhammadshafi@gmail.com
        </Link>
      </Typography>
      <Button variant="contained" color="info" onClick={reset}>
        Reload
      </Button>
    </Box>
  );
};
