import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import useUserFlow from '~app/hooks/useUserFlow';
import { useStyles } from '~app/components/RegisterValidatorHome/components/SelectOperators/SelectOperators.styles';
import SecondSquare from '~app/components/RegisterValidatorHome/components/SelectOperators/components/SecondSquare';
import FirstSquare from '~app/components/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/FirstSquare';

const SelectOperators = () => {
    const classes = useStyles();
    const { redirectUrl, history } = useUserFlow();

    useEffect(() => {
        redirectUrl && history.push(redirectUrl);
    }, [redirectUrl]);
    
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
