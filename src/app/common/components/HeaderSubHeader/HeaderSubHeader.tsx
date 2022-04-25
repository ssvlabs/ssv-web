import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useStyles } from '~app/common/components/HeaderSubHeader/HeaderSubHeader.styles';

type HeaderProps = {
    title?: string,
    subtitle?: any,
    rewardPage?: boolean,
};

const HeaderSubHeader = ({ title, subtitle, rewardPage }: HeaderProps) => {
    const classes = useStyles({ rewardPage });
    return (
      <Grid container item>
        {title && <Grid item xs={12} className={classes.Header}>{title}</Grid>}
        {subtitle && <Grid item className={classes.SubHeader}>{subtitle}</Grid>}
      </Grid>
    );
};

export default HeaderSubHeader;
