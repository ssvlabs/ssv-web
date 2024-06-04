import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import { useAppSelector } from '~app/hooks/redux.hook';
import { useStores } from '~app/hooks/useStores';
import { SingleCluster } from '~app/model/processes.model';
import { getAccountAddress } from '~app/redux/wallet.slice';
import { longStringShorten } from '~lib/utils/strings';
import { getClusterHash } from '~root/services/cluster.service';
import { useStyles } from '../../NewWhiteWrapper.styles';
import { getSelectedCluster } from '~app/redux/account.slice.ts';

type Props = {
  header: string;
  stepBack?: Function;
};

const ValidatorsFlow = ({ header, stepBack }: Props) => {
  const accountAddress = useAppSelector(getAccountAddress);
  const navigate = useNavigate();
  const classes = useStyles({ mainFlow: false });
  const stores = useStores();
  const processStore: ProcessStore = stores.Process;
  const process: SingleCluster = processStore.getProcess;
  const cluster = useAppSelector(getSelectedCluster);

  const onNavigationClicked = () => {
    if (!stepBack) {
      process.validator = undefined;
      navigate(-1);
    } else {
      stepBack();
    }
  };

  return (
    <Grid container item>
      <Grid
        container
        item
        xs={10}
        style={{ alignItems: 'center', textAlign: 'center', gap: 16 }}
      >
        <Grid
          item
          className={classes.BackNavigation}
          onClick={onNavigationClicked}
        />
        <Grid item className={classes.HeaderText}>
          {header}
        </Grid>
        <Grid item className={classes.subHeaderText}>
          |
        </Grid>
        <Grid item className={classes.subHeaderText}>
          {longStringShorten(
            getClusterHash(cluster.operators, accountAddress),
            4,
            undefined,
            { '': /^0x/ }
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default observer(ValidatorsFlow);
