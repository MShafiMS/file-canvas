import { STROKE, STROKESTYLE } from '@enums';
import { IElementAttributes } from '@stores';

export const defaultAttributes: IElementAttributes = {
  strokeWidth: STROKE.REGULAR,
  strokeColor: '#000000',
  strokeStyle: STROKESTYLE.SOLID,
  fillColor: '',
  opacity: 1,
};
