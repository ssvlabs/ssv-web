import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getIsLoading } from '~app/redux/appState.slice';

const BackNavigationWrapper = styled.div`
  gap: 4px;
  height: 16px;
  display: flex;
  color: #1ba5f8;
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
  color?: string;
  onClick?: () => void | null | undefined;
  backButtonRedirect?: string;
};

const BackNavigation = ({ color, onClick, backButtonRedirect }: BackNavigationProps) => {
  const navigate = useNavigate();
  const defaultColor = '#A1ACBE';
  const usedColor = color || defaultColor;
  const isLoading = useAppSelector(getIsLoading);

  const onNavigationClicked = async () => {
    let clickHandler = () => {};
    if (typeof onClick === 'function') {
      clickHandler = onClick;
    }
    await clickHandler();
    setTimeout(() => {
      if (isLoading) return;
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
