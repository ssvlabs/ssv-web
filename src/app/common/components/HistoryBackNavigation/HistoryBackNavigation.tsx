import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const BackNavigationLink = styled.div<Record<string, any>>`
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
  text?: string,
  color?: string
};

const HistoryBackNavigation = ({ text, color }: BackNavigationProps) => {
  const backText = text || 'Back';
  const defaultColor = '#AAAAAA';
  const usedColor = color || defaultColor;
  const history = useHistory();

  return (
    <BackNavigationWrapper onClick={() => { history.goBack(); }}>
      <BackIcon iconcolor={usedColor} />
      <BackNavigationLink color={usedColor}>
        {backText}
      </BackNavigationLink>
    </BackNavigationWrapper>
  );
};

export default HistoryBackNavigation;
