import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export interface IFileProp {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export const FileCard = ({ id, author, width, height, url, download_url }: IFileProp) => {
  return (
    <Card sx={{ width: '100%' }}>
      <CardMedia sx={{ height: 140 }} image={download_url} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {author}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents
          except Antarctica
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Delete</Button>
        <Button size="small">Open</Button>
      </CardActions>
    </Card>
  );
};
