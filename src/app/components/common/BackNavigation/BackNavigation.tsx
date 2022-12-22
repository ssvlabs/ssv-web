import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
// import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
const BackNavigationWrapper = styled.div`
  gap: 4px;
  height: 16px;
  flex-grow: 1;
  display: flex;
  color: #1BA5F8;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
  line-height: 1.25;
  font-style: normal;
  align-items: center;
  font-stretch: normal;
  align-content: center;
  text-decoration: none;
`;

const BackNavigationImage = styled.div<Record<string, any>>`
  width: 14px;
  height: 14px;
  letter-spacing: normal;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(/images/backButton/light.svg);
`;

type BackNavigationProps = {
  color?: string
  onClick?: () => void | null | undefined,
  backButtonRedirect?: string,
};

const BackNavigation = ({ color, onClick, backButtonRedirect }: BackNavigationProps) => {
  const stores = useStores();
  const navigate = useNavigate();
  const defaultColor = '#A1ACBE';
  const usedColor = color || defaultColor;
  const applicationStore: ApplicationStore = stores.Application;

  const onNavigationClicked = async () => {
    let clickHandler = () => {
    };
    if (typeof onClick === 'function') {
      clickHandler = onClick;
    }
    await clickHandler();
    setTimeout(() => {
      if (applicationStore.isLoading) return;
      if (backButtonRedirect) {
        navigate(backButtonRedirect);
      } else {
        navigate(-1);
      }
    }, 100);
  };

  return (
    <BackNavigationWrapper onClick={onNavigationClicked}>
      <BackNavigationImage color={usedColor} />
      <span>Back</span>
    </BackNavigationWrapper>
  );
};

export default BackNavigation;
