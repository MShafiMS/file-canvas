import { STROKE } from '@enums';
import { Box, ButtonBase, Paper, Typography } from '@mui/material';
import { ElementAttributes } from '@types';

const colors = ['#000000', '#e91e63', '#9c27b0', '#3f51b5', '#2196f3'];
const bgcolors = ['', '#f48fb1', '#ce93d8', '#9fa8da', '#90caf9'];
const strokes = Object.values(STROKE);
interface IProps {
  attributes: ElementAttributes;
  setAttributes: (a: ElementAttributes) => void;
}

export const Panel = ({ attributes, setAttributes }: IProps) => {
  const { fillColor, strokeColor, strokeWidth } = attributes;

  const handleSetAttributes = (attr: Partial<ElementAttributes>) => {
    setAttributes({ ...attributes, ...attr });
  };

  return (
    <Paper
      elevation={1}
      sx={{
        position: 'absolute',
        left: 16,
        top: 60,
        zIndex: 10,
        padding: 1,
        bgcolor: 'background.default',
        color: 'primary.light',
        height: 'fit-content',
        borderRadius: 1,
        paddingBottom: 2,
      }}
    >
      <Typography display="block" fontSize={12} fontWeight={600}>
        Properties
      </Typography>
      <Typography display="block" marginTop={1} fontSize={12}>
        Stroke
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, marginTop: 1, paddingX: 1 }}>
        {colors.map((color, i) => (
          <ButtonBase
            onClick={() => handleSetAttributes({ strokeColor: color })}
            key={i}
            sx={{
              height: 24,
              width: 24,
              bgcolor: color,
              borderRadius: 1,
              outline: strokeColor === color ? 1 : 0,
              outlineColor: 'grey',
              outlineOffset: 2,
            }}
          />
        ))}
      </Box>
      <Typography display="block" marginTop={1} fontSize={12}>
        Background
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, marginTop: 1, paddingX: 1 }}>
        {bgcolors.map((color, i) => (
          <ButtonBase
            key={i}
            onClick={() => handleSetAttributes({ fillColor: color })}
            sx={{
              height: 24,
              width: 24,
              bgcolor: color,
              border: fillColor === color ? undefined : '0.5px solid grey',
              borderRadius: 1,
              outline: fillColor === color ? 1 : 0,
              outlineColor: 'grey',
              outlineOffset: 2,
            }}
          />
        ))}
      </Box>
      <Typography display="block" marginTop={1} fontSize={12}>
        Stroke Width
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, marginTop: 1, paddingX: 1 }}>
        {[...Array(3)].map((_, i) => (
          <ButtonBase
            key={i}
            onClick={() => handleSetAttributes({ strokeWidth: strokes[i] })}
            sx={{
              height: 24,
              width: 24,
              bgcolor: 'azure',
              borderRadius: 1,
              outline: 1,
              outlineColor: strokes[i] === strokeWidth ? 'skyblue' : 'whitesmoke',
              outlineOffset: 2,
            }}
          >
            <div style={{ width: 12, height: i + 1, background: 'black' }} />
          </ButtonBase>
        ))}
      </Box>
    </Paper>
  );
};
