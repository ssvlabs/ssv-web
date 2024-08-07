import styled from 'styled-components';
import { ButtonSize } from '~app/enums/Button.enum';
import Spinner from '~app/components/common/Spinner';
import { ButtonPropsType } from '~app/types/ButtonPropsType.ts';

const Button = styled.div<{
  theme: any;
  size: ButtonSize;
  isDisabled: boolean;
  isLoading: boolean;
  isReverseDirection: boolean;
  zIndex: number;
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
  align-items: center;
  border-radius: 8px;
  text-wrap: nowrap;
  font-size: 16px;
  padding: 0 18px;
  font-weight: 600;
  z-index: ${({ zIndex }) => zIndex};
  flex-direction: ${({ isReverseDirection }) => (isReverseDirection ? 'row-reverse' : 'row')};
  color: ${({ theme, isDisabled, isLoading }) => {
    if (isLoading) {
      return theme.colors.tint20;
    }
    return isDisabled ? theme.colors.gray40 : theme.colors.white;
  }};
  cursor: ${({ isDisabled, isLoading }) => (isDisabled || isLoading ? 'default' : 'pointer')};
  background-color: ${({ theme, isDisabled, isLoading }) => {
    if (isLoading) {
      return theme.colors.tint80;
    }
    return isDisabled ? theme.colors.gray20 : theme.colors.primaryBlue;
  }};

  :hover {
    background-color: ${({ theme, isDisabled, isLoading }) => !isDisabled && !isLoading && theme.colors.shade20};
  }

  :active {
    background-color: ${({ theme, isDisabled, isLoading }) => !isDisabled && !isLoading && theme.colors.shade40};
  }
`;

const Icon = styled.div<{ path: string }>`
  width: 24px;
  height: 24px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: ${({ path }) => `url(${path})`};
`;

const PrimaryButton = ({ size, text, icon, isReverseDirection = false, onClick, isDisabled = false, isLoading = false, zIndex = 0 }: ButtonPropsType) => {
  const handleOnClickFunction = () => onClick && !isDisabled && !isLoading && onClick();

  return (
    <Button zIndex={zIndex} isReverseDirection={isReverseDirection} isLoading={isLoading} onClick={handleOnClickFunction} size={size} isDisabled={isDisabled}>
      {isLoading && <Spinner />}
      {text}
      {icon && <Icon path={icon} />}
    </Button>
  );
};

export default PrimaryButton;
