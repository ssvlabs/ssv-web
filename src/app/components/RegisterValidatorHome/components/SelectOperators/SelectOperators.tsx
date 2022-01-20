import React from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useStyles } from '~app/components/RegisterValidatorHome/components/SelectOperators/SelectOperators.styles';
import SecondSquare from '~app/components/RegisterValidatorHome/components/SelectOperators/components/SecondSquare';
import FirstSquare from '~app/components/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/FirstSquare';

const SelectOperators = () => {
    const classes = useStyles();

    return (
      <Grid container className={classes.Container}>
        <Grid item className={classes.FirstSquare}>
          <FirstSquare />
        </Grid>
        <Grid item className={classes.SecondSquare}>
          <SecondSquare />
        </Grid>
      </Grid>
    );
};

export default observer(SelectOperators);
