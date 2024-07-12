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
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        top: 16,
        zIndex: 10,
        paddingX: 2,
        paddingY: 1,
        bgcolor: 'background.default',
        color: 'primary.light',
        width: 'fit-content',
        marginBottom: 2,
        borderRadius: 2,
        display: 'flex',
        gap: 1,
      }}
    >
      {Object.values(Tool).map((item) => (
        <ButtonBase
          key={item}
          onClick={() => setTool(item)}
          sx={{
            height: 40,
            width: 40,
            borderRadius: 1,
            bgcolor: item === tool ? 'primary.main' : undefined,
            color: item === tool ? 'white' : undefined,
          }}
        >
          {toolIcon[item]}
        </ButtonBase>
      ))}
    </Box>
  );
};
