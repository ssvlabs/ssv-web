import styled from 'styled-components';
import DarkModeSwitcher from '~app/components/common/AppBar/components/DarkModeSwitcher';

const Wrapper = styled.div`
  width: 100%;
  height: 80px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AppBarLogo = styled.div`
  height: 40px;
  width: 133px;
  cursor: default;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: ${({ theme }) => `url(/images/logo/${theme.colors.isDarkMode ? 'light' : 'dark'}.svg)`};
`;

const SimpleAppBar = () => {
  return (
    <Wrapper>
      <AppBarLogo />
      <DarkModeSwitcher />
    </Wrapper>
  );
};

export default SimpleAppBar;
