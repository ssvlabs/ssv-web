import { ButtonSize } from '~app/enums/Button.enum.ts';

export type ButtonPropsType = {
  size: ButtonSize;
  text: string;
  icon?: string;
  isReverseDirection?: boolean;
  onClick?: Function;
  isDisabled?: boolean;
  isLoading?: boolean;
  zIndex?: number;
  hasBgColor?: boolean;
};
