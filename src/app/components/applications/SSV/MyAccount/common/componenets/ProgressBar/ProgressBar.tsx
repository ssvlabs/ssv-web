import React from 'react';
import { Grid } from '@mui/material';
import { observer } from 'mobx-react';
import { useStyles } from '~app/components/applications/SSV/MyAccount/common/componenets/ProgressBar/ProgressBar.styles';

type Props = {
    remainingDays: number,
};

const ProgressBar = (props: Props) => {
    const { remainingDays } = props;
    const classes = useStyles();

    return (
      <Grid item container>
        <Grid item className={classes.LiquidationProgress}>
          <Grid style={{ width: `${100 - (Math.floor(remainingDays) / 30) * 100}%` }} className={classes.LiquidationProgressRed} />
        </Grid>
      </Grid>
    );
};

export default observer(ProgressBar);
