import React from 'react';
import styled from 'styled-components';
import { ButtonSize, IconDirection } from '~app/enums/Button.enum';

const Button = styled.div<{ theme: any, size: ButtonSize, withoutBackgroundColor: boolean, isDisabled: boolean, reverseDirection: boolean }>`
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
    flex-direction: ${({ reverseDirection }) => reverseDirection ? 'row-reverse' : 'row'};
    color: ${({ theme, isDisabled }) => isDisabled ? theme.colors.gray40 : theme.colors.primaryBlue};
    cursor: pointer;
    background-color: ${({ theme, withoutBackgroundColor, isDisabled }) => {
      if (isDisabled) {
        return theme.colors.gray20;
      }
       return withoutBackgroundColor ? 'inherit' : theme.colors.tint90;
    }};
    :hover {
        background-color: ${({ theme, isDisabled }) => !isDisabled && theme.colors.tint80};
    }
    :active {
        background-color: ${({ theme, isDisabled }) => !isDisabled && theme.colors.tint70};
    }
`;

const Icon = styled.div<{ path: string, size: ButtonSize }>`
    width: 24px;
    height: 24px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    background-image: ${({ path }) => `url(${path})`};
`;

const SecondaryButton = ({ size, text, icon, reverseDirection = false, onClick, withoutBackgroundColor = false, isDisabled = false }: {
  size: ButtonSize,
  text: string,
  icon?: string,
  reverseDirection?: boolean,
  onClick: Function,
  withoutBackgroundColor?: boolean
  isDisabled?: boolean;
}) => {

  const handleOnClickFunction = () => !isDisabled && onClick();

  return (
    <Button reverseDirection={reverseDirection}  onClick={handleOnClickFunction} size={size} withoutBackgroundColor={withoutBackgroundColor} isDisabled={isDisabled}>
      {text}
      {icon && <Icon size={size}  path={icon}/>}
    </Button>
  );
};

export default SecondaryButton;