import React from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/SelectOperators.styles';
import SecondSquare from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/SecondSquare';
import FirstSquare from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/FirstSquare';

const SelectOperators = ({ editPage }: { editPage?: boolean }) => {
    const classes = useStyles({ editPage });

    return (
      <Grid container className={classes.Container}>
        <Grid item className={classes.FirstSquare}>
          <FirstSquare editPage={editPage ?? false} />
        </Grid>
        <Grid item className={classes.SecondSquare}>
          <SecondSquare editPage={editPage ?? false} />
        </Grid>
      </Grid>
    );
};

export default observer(SelectOperators);
