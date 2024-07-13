import Typography from '@mui/material/Typography';

interface TitleProps {
  children?: React.ReactNode;
}

export const Title = (props: TitleProps) => {
  return (
    <Typography component="h2" variant="h6" gutterBottom>
      {props.children}
    </Typography>
  );
};
