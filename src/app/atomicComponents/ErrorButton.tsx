import styled from 'styled-components';
import Spinner from '~app/components/common/Spinner';
import { ButtonSize } from '~app/enums/Button.enum';
import { ButtonPropsType } from '~app/types/ButtonPropsType.ts';

const Button = styled.div<{
  theme: any;
  size: ButtonSize;
  isDisabled: boolean;
  isLoading: boolean;
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
  flex-direction: ${({ isReverseDirection }) => (isReverseDirection ? 'row-reverse' : 'row')};
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  text-wrap: nowrap;
  font-size: 16px;
  padding: 0 18px;
  font-weight: 600;
  border: ${({ isLoading, theme, isDisabled }) => !isDisabled && `1px solid ${isLoading ? theme.colors.primaryErrorRegular : theme.colors.primaryError}`};
  color: ${({ theme, isDisabled }) => {
    return isDisabled ? theme.colors.gray40 : theme.colors.primaryError;
  }};
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
  background-color: ${({ theme, isDisabled }) => (isDisabled ? theme.colors.gray20 : 'rgba(236, 28, 38, 0.03)')};
  :hover {
    background-color: ${({ isDisabled, isLoading }) => !isDisabled && !isLoading && 'rgba(236, 28, 38, 0.1)'};
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

const ErrorButton = ({ size, text, icon, isReverseDirection = false, onClick, isDisabled = false, isLoading = false }: ButtonPropsType) => {
  const handleOnClickFunction = () => onClick && !isDisabled && !isLoading && onClick();

  return (
    // @ts-ignore
    <Button isReverseDirection={isReverseDirection} isLoading={isLoading} onClick={handleOnClickFunction} size={size} isDisabled={isDisabled}>
      {isLoading && <Spinner errorSpinner={true} />}
      {text}
      {icon && <Icon path={icon} />}
    </Button>
  );
};

export default ErrorButton;
