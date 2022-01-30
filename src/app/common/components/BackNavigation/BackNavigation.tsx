import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
// import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const BackNavigationLink = styled.div<Record<string, any>>`
  color: #A1ACBE;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
  line-height: 1.25;
  font-style: normal;
  font-stretch: normal;
  text-decoration: none;
  letter-spacing: normal;
`;

// const BackIcon = styled(ArrowBackIosIcon)<Record<string, any>>`
//   cursor: pointer;
//   font-weight: bold;
//   font-style: normal;
//   color: #A1ACBE;
//   font-size: 12px;
//   text-decoration: none;
// `;

const BackNavigationWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  align-content: center;
`;

type BackNavigationProps = {
  to: string,
  text?: string,
  color?: string
  onClick?: () => void
};

const BackNavigation = ({ to, text, color, onClick }: BackNavigationProps) => {
  const defaultColor = '#A1ACBE';
  const history = useHistory();
  const usedColor = color || defaultColor;
  const onNavigationClicked = () => {
    to && history.push(to);
    if (typeof onClick === 'function') {
      onClick();
    }
  };

  return (
    <BackNavigationWrapper onClick={onNavigationClicked}>
      {/* <BackIcon iconcolor={usedColor} /> */}
      <BackNavigationLink color={usedColor}>
        {text || '< Back'}
      </BackNavigationLink>
    </BackNavigationWrapper>
  );
};

export default BackNavigation;
