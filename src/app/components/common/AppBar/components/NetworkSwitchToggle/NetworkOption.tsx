import React from 'react';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { useStores } from '~app/hooks/useStores';
import { NETWORK_VARIABLES } from '~root/providers/networkInfo.provider';
import { useStyles } from '~app/components/common/AppBar/components/NetworkSwitchToggle/NetworkToggle.styles';

const NetworkOption = ({ networkId, apiVersion, onClick }: { networkId: number; apiVersion: string; onClick: any }) => {
  const stores = useStores();
  const { optionLabel, logo } = NETWORK_VARIABLES[`${networkId}_${apiVersion}`];
  const classes = useStyles({ logo });

  return (
    <Grid container item className={classes.Button} onClick={onClick}>
      <Grid className={classes.NetworkIcon}/>
      <Typography className={classes.NetworkLabel}>{optionLabel}</Typography>
    </Grid>
  );
};

export default NetworkOption;
