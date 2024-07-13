import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Title } from './Title';

// Generate Drawing Data
function createData(
  id: number,
  date: string,
  drawingTitle: string,
  material: string,
  fileFormat: string,
  size: string,
) {
  return { id, date, drawingTitle, material, fileFormat, size };
}

const rows = [
  createData(0, '16 Mar, 2024', 'Sunset Landscape', 'Oil on Canvas', 'PNG', '1.5 MB'),
  createData(1, '16 Mar, 2024', 'Mountain View', 'Watercolor', 'JPEG', '2.1 MB'),
  createData(2, '16 Mar, 2024', 'Cityscape', 'Acrylic', 'SVG', '500 KB'),
  createData(3, '16 Mar, 2024', 'Forest Path', 'Charcoal', 'GIF', '3.2 MB'),
  createData(4, '15 Mar, 2024', 'Ocean Wave', 'Pastel', 'BMP', '1.8 MB'),
];

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export const Drawings = () => {
  return (
    <>
      <Title>Recent Drawings</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Material</TableCell>
            <TableCell>Format</TableCell>
            <TableCell align="right">Size</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.drawingTitle}</TableCell>
              <TableCell>{row.material}</TableCell>
              <TableCell>{row.fileFormat}</TableCell>
              <TableCell align="right">{row.size}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more drawings
      </Link>
    </>
  );
};
