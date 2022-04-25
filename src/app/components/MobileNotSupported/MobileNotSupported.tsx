import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useStyles } from '~app/components/MobileNotSupported/MobileNotSupported.styles';

const MobileNotSupported = () => {
    const classes = useStyles();

    return (
      <Grid className={classes.Wrapper}>
        <Typography className={classes.Header}>We don’t  support mobile devices yet</Typography>
        <Typography className={classes.SubHeader}>Feel free to visit the website using a computer</Typography>
        <Grid className={classes.Image} />
      </Grid>
);
};

export default observer(MobileNotSupported);
