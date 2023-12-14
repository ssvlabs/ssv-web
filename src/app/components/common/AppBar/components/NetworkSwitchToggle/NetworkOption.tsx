import React from 'react';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { useStores } from '~app/hooks/useStores';
import { changeCurrentNetwork, NetworkDataType } from '~lib/utils/envHelper';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import { useStyles } from '~app/components/common/AppBar/components/NetworkSwitchToggle/NetworkToggle.styles';

const NetworkOption = ({ network, onClick }: { network: NetworkDataType, onClick: any }) => {
  const stores = useStores();
  const walletStore: WalletStore = stores.Wallet;
  const { networkId, optionLabel, logo, apiVersion } = network;

  const classes = useStyles({ logo });

  return (
    <Grid container item className={classes.Button} onClick={onClick}>
      <Grid className={classes.NetworkIcon}/>
      <Typography className={classes.NetworkLabel}>{optionLabel}</Typography>
    </Grid>
  );
};

export default NetworkOption;
