import Grid from '@mui/material/Grid';
import styled from 'styled-components';
import { ReactElement } from 'react';

const HeaderTitleWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const CloseButton = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: ${({ theme }) => `url(/images/exit/${theme.colors.isDarkMode ? 'dark' : 'light'}.svg)`};
`;

const Header = styled.h1<{ theme: string; marginBottom: number | undefined }>`
  margin: 0;
  z-index: 9;
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.gray90};
  margin-bottom: ${({ marginBottom }) => {
    if (marginBottom) return `${marginBottom}px`;
    return '12px';
  }};
`;

const SubHeader = styled.p<{
  theme: string;
  marginBottom: number | undefined;
  rewardPage: boolean | undefined;
}>`
  margin: 0;
  z-index: 9;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray80};
  margin-bottom: ${({ marginBottom, rewardPage }) => {
    if (marginBottom) return marginBottom;
    if (rewardPage) return '16px';
    return '32px';
  }};
`;

type HeaderProps = {
  title?: string | ReactElement;
  subtitle?: any;
  rewardPage?: boolean;
  marginBottom?: number;
  showCloseButton?: boolean;
  closeButtonAction?: Function;
};

const HeaderSubHeader = ({ title, subtitle, rewardPage, marginBottom, showCloseButton, closeButtonAction }: HeaderProps) => (
  <Grid container item>
    {title && (
      <HeaderTitleWrapper>
        <Header marginBottom={marginBottom}>{title}</Header>
        {showCloseButton && closeButtonAction && <CloseButton onClick={() => closeButtonAction()} />}
      </HeaderTitleWrapper>
    )}
    {subtitle && (
      <SubHeader rewardPage={rewardPage} marginBottom={marginBottom}>
        {subtitle}
      </SubHeader>
    )}
  </Grid>
);

export default HeaderSubHeader;
