import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import { longStringShorten } from '~lib/utils/strings';
import { useStyles } from '../../NewWhiteWrapper.styles';
import ProcessStore, { SingleCluster } from '~app/common/stores/applications/SsvWeb/Process.store';
import { WalletStore } from '~app/common/stores/applications/SsvWeb';
import { getClusterHash } from '~root/services/cluster.service';

type Props = {
  header: string,
  stepBack?: Function
};

const ValidatorsFlow = (props: Props) => {
  const { header } = props;
  const stores = useStores();
  const navigate = useNavigate();
  const classes = useStyles({ mainFlow: false });
  const processStore: ProcessStore = stores.Process;
  const walletStore: WalletStore = stores.Wallet;
  const process: SingleCluster = processStore.getProcess;
  const cluster = process?.item;

  const onNavigationClicked = () => {
    if (!props.stepBack) {
      process.validator = undefined;
      navigate(-1);
    } else {
      props.stepBack();
    }
  };

  return (
      <Grid container item>
        <Grid container item xs={10} style={{  alignItems: 'center', textAlign: 'center', gap: 16 }}>
          <Grid item className={classes.BackNavigation} onClick={onNavigationClicked} />
          <Grid item className={classes.HeaderText}>{header}</Grid>
          <Grid item className={classes.subHeaderText}>|</Grid>
          <Grid item className={classes.subHeaderText}>{longStringShorten(getClusterHash(cluster.operators, walletStore.accountAddress), 4, undefined, { '': /^0x/ })}</Grid>
        </Grid>
      </Grid>
  );
};

export default observer(ValidatorsFlow);
