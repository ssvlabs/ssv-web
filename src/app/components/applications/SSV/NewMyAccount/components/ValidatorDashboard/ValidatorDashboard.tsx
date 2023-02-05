import React from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from '../../NewMyAccount.styles';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import Dashboard from '~app/components/applications/SSV/NewMyAccount/components/Dashboard/Dashboard';

const ValidatorDashboard = ({ changeState }: { changeState: any }) => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const validatorStore: ValidatorStore = stores.Validator;
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
    validatorStore.processValidatorPublicKey = myAccountStore.ownerAddressValidators[listIndex].public_key;
    navigate(config.routes.SSV.MY_ACCOUNT.VALIDATOR.ROOT);
  };

  return (
    <Grid container className={classes.MyAccountWrapper}>
      <Grid container item className={classes.HeaderWrapper}>
        <Grid container item xs style={{ cursor: 'pointer' }}>
          <Typography className={classes.Header} onClick={()=>changeState(2)}>Validator Cluster</Typography>
          <Grid className={classes.Arrow} />
        </Grid>
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
