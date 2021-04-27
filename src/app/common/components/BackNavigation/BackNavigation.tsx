import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const BackNavigationLink = styled(Link)<Record<string, any>>`
  cursor: pointer;
  font-weight: 400;
  font-style: normal;
  color: ${({ color }) => color};
  font-size: 14px;
  text-decoration: none;
`;

const BackIcon = styled(ArrowBackIosIcon)<Record<string, any>>`
  cursor: pointer;
  font-weight: 400;
  font-style: normal;
  color: ${({ iconcolor }) => iconcolor};
  font-size: 16px;
`;

const BackNavigationWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  align-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

type BackNavigationProps = {
  to: any,
  text?: string,
  color?: string
};

const BackNavigation = ({ to, text, color }: BackNavigationProps) => {
  const backText = text || 'Back';
  const defaultColor = '#AAAAAA';
  const usedColor = color || defaultColor;

  return (
    <BackNavigationWrapper>
      <BackIcon iconcolor={usedColor} />
      <BackNavigationLink to={to} color={usedColor}>
        {backText}
      </BackNavigationLink>
    </BackNavigationWrapper>
  );
};

export default BackNavigation;
