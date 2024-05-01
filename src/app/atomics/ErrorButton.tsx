import React from 'react';
import styled from 'styled-components';
import { ButtonSize, IconDirection } from '~app/enums/Button.enum';
import Spinner from '~app/components/common/Spinner';

const Button = styled.div<{ theme: any, size: ButtonSize, isDisabled: boolean, isLoading: boolean, reverseDirection: boolean }>`
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
    flex-direction: ${({ reverseDirection }) => reverseDirection ? 'row-reverse' : 'row'};
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    text-wrap: nowrap;
    font-size: 16px;
    padding: 0 18px;
    font-weight: 600;
    border: ${({ isLoading, theme, isDisabled }) => !isDisabled && `1px solid ${isLoading ? theme.colors.primaryErrorRegular : theme.colors.primaryError}`};
    color: ${({ theme, isDisabled, isLoading }) => {
        return isDisabled ? theme.colors.gray40 :  theme.colors.primaryError;
    }};
    cursor: ${({ isDisabled }) => isDisabled ? 'default' : 'pointer'};;
    background-color: ${({ theme, isDisabled }) => isDisabled ? theme.colors.gray20 : 'rgba(236, 28, 38, 0.03)'};
    :hover {
        background-color: ${({ theme, isDisabled, isLoading }) => !isDisabled && !isLoading && 'rgba(236, 28, 38, 0.1)'};
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

const ErrorButton = ({ size, text, icon, reverseDirection = false, onClick, isDisabled = false, isLoading = false }: {
  size: ButtonSize,
  text: string,
  icon?: string,
  reverseDirection?: boolean,
  onClick?: Function,
  isDisabled?: boolean,
  isLoading?: boolean
}) => {
  const handleOnClickFunction = () => onClick && !isDisabled && !isLoading && onClick();

  return (
    <Button reverseDirection={reverseDirection} isLoading={isLoading} onClick={handleOnClickFunction} size={size} isDisabled={isDisabled}>
      {isLoading && <Spinner errorSpinner={true} />}
      {text}
      {icon && <Icon path={icon}/>}
    </Button>
  );
};

export default ErrorButton;