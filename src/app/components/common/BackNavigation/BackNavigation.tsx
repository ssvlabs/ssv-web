import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getIsLoading } from '~app/redux/appState.slice';

const BackNavigationWrapper = styled.div<{ isColoredText: boolean }>`
  gap: 12px;
  height: 16px;
  display: flex;
  color: ${({ theme, isColoredText }) => (isColoredText ? theme.colors.gray90 : theme.colors.primaryBlue)};
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
  text?: string;
  backButtonRedirect?: string;
};

const BackNavigation = ({ color, onClick, backButtonRedirect, text }: BackNavigationProps) => {
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
    <BackNavigationWrapper onClick={onNavigationClicked} isColoredText={!!text}>
      <BackNavigationImage color={usedColor} />
      <span>{text || 'Back'}</span>
    </BackNavigationWrapper>
  );
};

export default BackNavigation;
