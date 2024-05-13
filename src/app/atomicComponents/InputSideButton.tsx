import React from 'react';
import styled from 'styled-components';
import Grid from './Grid';

const Wrapper = styled(Grid)<{ theme: any; isConfirmedState: boolean | undefined; isDisabled: boolean | undefined; }>`
    position: relative;
    bottom: 5px;
    padding: 4px 8px 4px 8px;
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme, isDisabled }) => isDisabled ? theme.colors.gray40 : theme.colors.gray90};
    border-radius: 8px;
    background-color: ${({ theme, isConfirmedState }) => isConfirmedState ? '#1fcf98' : theme.colors.gray20};
    cursor: ${({ isDisabled }) => isDisabled ? 'default' : 'pointer'};
`;

const InputSideButton = ({ sideButtonAction, sideButtonLabel, isDisabled, isConfirmedState }: { sideButtonAction: any, sideButtonLabel: string, isDisabled?: boolean, isConfirmedState?: boolean }) => (
    <Wrapper onClick={sideButtonAction} isConfirmedState={isConfirmedState} isDisabled={isDisabled}>{sideButtonLabel}</Wrapper>
);

export default InputSideButton;
