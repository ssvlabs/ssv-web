import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from '../../NewMyAccount.styles';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import Dashboard from '~app/components/applications/SSV/NewMyAccount/components/Dashboard';
import ToggleDashboards from '~app/components/applications/SSV/NewMyAccount/components/ToggleDashboards';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';

const ValidatorDashboard = ({ changeState }: { changeState: any }) => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const processStore: ProcessStore = stores.Process;
  const myAccountStore: MyAccountStore = stores.MyAccount;

  const moveToRegisterValidator = () => {
    navigate(config.routes.SSV.VALIDATOR.HOME);
  };

  const createData = (
      clusterID: string,
      operators: string,
      validators: number,
      operational_runway: string,
  ) => {
    return { clusterID, operators, validators, operational_runway };
  };

  const rows = [
    createData('e3b0...b855', '1,2,3,4', 12, '657 Days'),
    createData('e3b0...b855', '1,2,3,4', 98, '876 Days'),
    createData('e3b0...b855', '1,2,3,4', 4, '432 Days'),
    createData('e3b0...b855', '1,2,3,4', 342, '654 Days'),
    createData('e3b0...b855', '1,2,3,4', 675, '345 Days'),
  ];

  const openSingleValidator = (listIndex: string) => {
    processStore.setProcess({
      processName: 'single_validator',
      item: myAccountStore.ownerAddressValidators[listIndex],
    }, 2);
    navigate(config.routes.SSV.MY_ACCOUNT.VALIDATOR.ROOT);
  };

  return (
    <Grid container className={classes.MyAccountWrapper}>
      <Grid container item className={classes.HeaderWrapper}>
        <ToggleDashboards changeState={changeState} title={'Validator Clusters'} />
        <Grid container item xs className={classes.HeaderButtonsWrapper}>
          <Grid item className={`${classes.HeaderButton} ${classes.lightHeaderButton}`}>
            Fee Address
          </Grid>
          <Grid item className={classes.HeaderButton} onClick={moveToRegisterValidator}>Add Cluster</Grid>
        </Grid>
      </Grid>
      <Dashboard
          rows={rows}
          rowsAction={openSingleValidator}
          columns={[
            { name: 'Cluster ID', tooltip: 'asdad' },
            { name: 'Operators' },
            { name: 'Validators' },
            { name: 'Operational Runway' },
          ]}
      />
    </Grid>
  );
};

export default observer(ValidatorDashboard);
