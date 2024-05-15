
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import { longStringShorten } from '~lib/utils/strings';
import { useStyles } from '../../NewWhiteWrapper.styles';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import { getClusterHash } from '~root/services/cluster.service';
import { SingleCluster } from '~app/model/processes.model';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getAccountAddress } from '~app/redux/wallet.slice';
import { useDispatch } from 'react-redux';
import { setSelectedClusterId } from '~app/redux/account.slice';

type Props = {
  header: string,
  stepBack?: Function
};

const ValidatorsFlow = ({  header, stepBack }: Props) => {
  const accountAddress = useAppSelector(getAccountAddress);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles({ mainFlow: false });
  const stores = useStores();
  const processStore: ProcessStore = stores.Process;
  const process: SingleCluster = processStore.getProcess;
  const cluster = process?.item;

  const onNavigationClicked = () => {
    if (!stepBack) {
      dispatch(setSelectedClusterId(''));
      process.validator = undefined;
      navigate(-1);
    } else {
      stepBack();
    }
  };

  return (
      <Grid container item>
        <Grid container item xs={10} style={{  alignItems: 'center', textAlign: 'center', gap: 16 }}>
          <Grid item className={classes.BackNavigation} onClick={onNavigationClicked} />
          <Grid item className={classes.HeaderText}>{header}</Grid>
          <Grid item className={classes.subHeaderText}>|</Grid>
          <Grid item className={classes.subHeaderText}>{longStringShorten(getClusterHash(cluster.operators, accountAddress), 4, undefined, { '': /^0x/ })}</Grid>
        </Grid>
      </Grid>
  );
};

export default observer(ValidatorsFlow);
