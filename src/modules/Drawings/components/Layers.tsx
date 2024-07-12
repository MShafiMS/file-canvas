import { Tool } from '@enums';
import { Delete } from '@mui/icons-material';
import { Divider, IconButton, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { ArrowDown, ArrowUp, ArrowUpRight, Circle, Rectangle, ScribbleLoop, TextT } from '@phosphor-icons/react';
import { ElementData } from '@types';

const labels = {
  [Tool.PENCIL]: 'doodle',
  [Tool.LINE]: 'line',
  [Tool.CIRCLE]: 'ellipse',
  [Tool.RECT]: 'rectangle',
  [Tool.TEXT]: 'text',
  [Tool.DEFAULT]: 'text',
  [Tool.DRAG]: 'text',
  [Tool.ERASER]: 'text',
};

const icons = {
  [Tool.PENCIL]: <ScribbleLoop />,
  [Tool.LINE]: <ArrowUpRight />,
  [Tool.CIRCLE]: <Circle />,
  [Tool.RECT]: <Rectangle />,
  [Tool.TEXT]: <TextT />,
  [Tool.DEFAULT]: <TextT />,
  [Tool.DRAG]: <TextT />,
  [Tool.ERASER]: <TextT />,
};

interface IProps {
  elements: ElementData[];
  removeElement: (id: string) => void;
  selectedElement: ElementData | null;
  changeDirection: (id: string, direction: 'forward' | 'backward') => void;
}

const style = {
  position: 'absolute',
  right: 16,
  top: 16,
  zIndex: 10,
  padding: 1,
  bgcolor: 'primary.dark',
  color: 'primary.light',
  height: 'fit-content',
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
};

export const Layers = ({ elements, removeElement, selectedElement, changeDirection }: IProps) => {
  return (
    <Paper elevation={3} sx={style}>
      <Typography display="block" fontSize={12} fontWeight={600}>
        Layers
      </Typography>
      <List
        sx={{ marginTop: 1, py: 0, width: '100%', minWidth: 200, maxHeight: '60vh', overflowY: 'auto' }}
        component="nav"
        dense
      >
        {elements
          .slice()
          .reverse()
          .map((element, index) => (
            <>
              <Divider component="li" sx={{ borderColor: 'divider' }} />
              <ListItem key={element.id} sx={{ bgcolor: selectedElement?.id === element.id ? 'divider' : undefined }}>
                {icons[element.type]}
                <ListItemText sx={{ marginLeft: 1 }} primary={labels[element.type]} />
                {index > 0 && (
                  <IconButton
                    onClick={() => changeDirection(element.id, 'forward')}
                    color="inherit"
                    size="small"
                    edge="end"
                  >
                    <ArrowUp color="black" />
                  </IconButton>
                )}
                {index + 1 !== elements.length && (
                  <IconButton
                    onClick={() => changeDirection(element.id, 'backward')}
                    color="inherit"
                    size="small"
                    edge="end"
                  >
                    <ArrowDown color="black" />
                  </IconButton>
                )}
                <IconButton
                  onClick={() => removeElement(element.id)}
                  color="error"
                  size="small"
                  edge="end"
                  aria-label="delete"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </ListItem>
            </>
          ))}
      </List>
    </Paper>
  );
};
