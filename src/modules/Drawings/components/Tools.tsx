import { Tool } from '@enums';
import { Box, ButtonBase } from '@mui/material';
import { ArrowUpRight, Circle, Cursor, Eraser, Hand, Pen, Rectangle, TextT } from '@phosphor-icons/react';

interface IProps {
  tool: Tool;
  setTool: React.Dispatch<React.SetStateAction<Tool>>;
}

const toolIcon = {
  [Tool.DEFAULT]: <Cursor size={20} weight="bold" />,
  [Tool.DRAG]: <Hand size={20} weight="bold" />,
  [Tool.PENCIL]: <Pen size={20} weight="bold" />,
  [Tool.ERASER]: <Eraser size={20} weight="bold" />,
  [Tool.LINE]: <ArrowUpRight size={20} weight="bold" />,
  [Tool.RECT]: <Rectangle size={20} weight="bold" />,
  [Tool.CIRCLE]: <Circle size={20} weight="bold" />,
  [Tool.TEXT]: <TextT size={20} weight="bold" />,
};

export const Tools = ({ tool, setTool }: IProps) => {
  return (
    <Box
      sx={{
        padding: 2,
        bgcolor: 'background.paper',
        color: 'primary.dark',
        width: 120,
        height: 'fit-content',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        borderRadius: 1,
      }}
    >
      {Object.values(Tool).map((item) => (
        <ButtonBase
          onClick={() => setTool(item)}
          sx={{
            height: 40,
            width: 40,
            borderRadius: 1,
            bgcolor: item === tool ? 'mintcream' : undefined,
            color: item === tool ? 'black' : undefined,
          }}
        >
          {toolIcon[item]}
        </ButtonBase>
      ))}
    </Box>
  );
};
