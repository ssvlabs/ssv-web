import styled from 'styled-components';
import { ButtonSize } from '~app/enums/Button.enum';
import Spinner from '~app/components/common/Spinner';
import { ButtonPropsType } from '~app/types/ButtonPropsType.ts';

const Button = styled.div<{
  theme: any;
  size: ButtonSize;
  hasBgColor: boolean;
  isDisabled: boolean;
  isReverseDirection: boolean;
}>`
  width: 100%;
  height: ${({ size }) => {
    if (size === ButtonSize.SM) {
      return '40px';
    }
    if (size === ButtonSize.MD) {
      return '48px';
    }
    return '60px';
  }};
  display: flex;
  justify-content: center;
  padding: 0 18px;
  align-items: center;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  flex-direction: ${({ isReverseDirection }) => (isReverseDirection ? 'row-reverse' : 'row')};
  color: ${({ theme, isDisabled }) => (isDisabled ? theme.colors.gray40 : theme.colors.primaryBlue)};
  cursor: pointer;
  background-color: ${({ theme, hasBgColor, isDisabled }) => {
    if (isDisabled) {
      return theme.colors.gray20;
    }
    return hasBgColor ? theme.colors.tint90 : 'inherit';
  }};
  :hover {
    background-color: ${({ theme, isDisabled }) => !isDisabled && theme.colors.tint80};
  }
  :active {
    background-color: ${({ theme, isDisabled }) => !isDisabled && theme.colors.tint70};
  }
`;

const Icon = styled.div<{ path: string; size: ButtonSize }>`
  width: 24px;
  height: 24px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: ${({ path }) => `url(${path})`};
`;

const SecondaryButton = ({ size, text, icon, isReverseDirection = false, onClick, hasBgColor = true, isDisabled = false, isLoading }: ButtonPropsType) => {
  const handleOnClickFunction = () => onClick && !isDisabled && !isLoading && onClick();

  return (
    <Button isReverseDirection={isReverseDirection} onClick={handleOnClickFunction} size={size} hasBgColor={hasBgColor} isDisabled={isDisabled}>
      {isLoading && <Spinner />}
      {text}
      {icon && <Icon size={size} path={icon} />}
    </Button>
  );
};

export default SecondaryButton;
