import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {
  useStyles,
} from '~app/components/applications/SSV/RegisterValidatorHome/components/ImportFile/flows/Operator/OperatorData.styles';

const OperatorData = ({ operatorId, operatorLogo, hasError }: { operatorId: string, operatorLogo: string, hasError: boolean }) => {
  const classes = useStyles({ operatorLogo, hasError } );

  return (
    <Grid className={classes.Wrapper}>
      <Grid className={classes.OperatorLogo}/>
      <Typography className={classes.OperatorId}>ID: {operatorId}</Typography>
    </Grid>
  );
};

export default OperatorData;