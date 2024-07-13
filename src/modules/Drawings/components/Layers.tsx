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
  isPopover?: boolean;
}

const style = {
  padding: 1,
  bgcolor: 'primary.dark',
  color: 'primary.light',
  height: 'fit-content',
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
};

export const Layers = ({ elements, removeElement, selectedElement, changeDirection, isPopover }: IProps) => {
  const styles = isPopover ? {} : { position: 'absolute', right: 16, top: 16, minHeight: 250, zIndex: 10 };
  return (
    <Paper elevation={3} sx={{ ...style, ...styles }}>
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
                    sx={{ color: 'primary.light' }}
                    size="small"
                    edge="end"
                  >
                    <ArrowUp />
                  </IconButton>
                )}
                {index + 1 !== elements.length && (
                  <IconButton
                    onClick={() => changeDirection(element.id, 'backward')}
                    sx={{ color: 'primary.light' }}
                    size="small"
                    edge="end"
                  >
                    <ArrowDown />
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
