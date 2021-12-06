import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useStyles } from '~app/common/components/HeaderSubHeader/HeaderSubHeader.styles';

type HeaderProps = {
    title: string,
    subtitle?: string,
};

const HeaderSubHeader = ({ title, subtitle }: HeaderProps) => {
    const classes = useStyles();
    return (
      <Grid container item>
        <Grid item className={classes.Header}>{title}</Grid>
        {subtitle && <Grid item className={classes.SubHeader}>{subtitle}</Grid>}
      </Grid>
    );
};

export default HeaderSubHeader;
