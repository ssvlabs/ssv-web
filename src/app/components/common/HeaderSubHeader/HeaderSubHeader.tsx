import React from 'react';
import Grid from '@mui/material/Grid';
import { useStyles } from '~app/components/common/HeaderSubHeader/HeaderSubHeader.styles';
import styled from 'styled-components';

type HeaderProps = {
    title?: string,
    subtitle?: any,
    rewardPage?: boolean,
    marginBottom?: number,
    showCloseButton?: boolean,
    closeButtonAction?: Function,
};

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

const HeaderSubHeader = ({ title, subtitle, rewardPage, marginBottom, showCloseButton, closeButtonAction }: HeaderProps) => {
    const classes = useStyles({ rewardPage, marginBottom });
    return (
      <Grid container item>
        {title &&
          <HeaderTitleWrapper>
              <Grid item xs={12} className={classes.Header}>{title}</Grid>
              {showCloseButton && closeButtonAction && <CloseButton onClick={() => closeButtonAction()}/>}
          </HeaderTitleWrapper>}
        {subtitle && <Grid item className={classes.SubHeader}>{subtitle}</Grid>}
      </Grid>
    );
};

export default HeaderSubHeader;
