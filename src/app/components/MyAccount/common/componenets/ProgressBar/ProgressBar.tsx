import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useStyles } from '~app/components/MyAccount/common/componenets/ProgressBar/ProgressBar.styles';

type Props = {
    remainingDays: number,
};

const ProgressBar = (props: Props) => {
    const { remainingDays } = props;
    const classes = useStyles();

    return (
      <Grid item container>
        <Grid item className={classes.LiquidationProgress}>
          <Grid style={{ width: `${100 - (remainingDays / 30) * 100}%` }} className={classes.LiquidationProgressRed} />
        </Grid>
      </Grid>
    );
};

export default observer(ProgressBar);
