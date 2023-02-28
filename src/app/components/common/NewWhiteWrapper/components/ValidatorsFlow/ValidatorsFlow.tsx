import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import { longStringShorten } from '~lib/utils/strings';
import { useStyles } from '../../NewWhiteWrapper.styles';
import ClusterStore from '~app/common/stores/applications/SsvWeb/Cluster.store';
import ProcessStore, { SingleCluster } from '~app/common/stores/applications/SsvWeb/Process.store';

type Props = {
  header: string,
};

const ValidatorsFlow = (props: Props) => {
  const { header } = props;
  const stores = useStores();
  const navigate = useNavigate();
  const classes = useStyles({ mainFlow: false });
  const processStore: ProcessStore = stores.Process;
  const clusterStore: ClusterStore = stores.Cluster;
  const process: SingleCluster = processStore.getProcess;
  const cluster = process?.item;

  const onNavigationClicked = async () => {
    navigate(-1);
  };

  return (
      <Grid container item>
        <Grid container item xs={10} style={{  alignItems: 'center', textAlign: 'center', gap: 16 }}>
          <Grid item className={classes.BackNavigation} onClick={onNavigationClicked} />
          <Grid item className={classes.HeaderText}>{header}</Grid>
          <Grid item className={classes.subHeaderText}>|</Grid>
          <Grid item className={classes.subHeaderText}>{longStringShorten(clusterStore.getClusterHash(cluster.operators), 4)}</Grid>
        </Grid>
      </Grid>
  );
};

export default observer(ValidatorsFlow);
