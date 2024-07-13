import { TextField } from '@mui/material';
import { ChangeEvent } from 'react';

export const ColorInput = ({
  value,
  label,
  onChange,
}: {
  value: string;
  label: string;
  onChange: (color: string) => void;
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const color = validateColorString(event.currentTarget.value);
    onChange(color || value);
  };
  return (
    <div>
      <TextField
        label={label}
        size="small"
        onChange={handleChange}
        value={value || ' '}
        color="info"
        InputProps={{
          startAdornment: <input type="color" value={value} id="color-input" onChange={handleChange} />,
        }}
      />
    </div>
  );
};

const validateColorString = (color: string): string => {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  if (hexRegex.test(color)) return color;
  else return '';
};
