import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { ISketch } from '@stores';
import * as React from 'react';
import { Canvas } from './Canvas';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
  open: boolean;
  onClose: () => void;
  template: ISketch;
};

export const CanvasDialog = ({ open, onClose, template }: Props) => {
  return (
    <React.Fragment>
      <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
        <Canvas onClose={onClose} template={template} />
      </Dialog>
    </React.Fragment>
  );
};
