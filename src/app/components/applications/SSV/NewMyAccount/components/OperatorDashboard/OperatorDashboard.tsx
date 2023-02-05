import React from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import Status from '~app/components/common/Status';
import { useStyles } from '../../NewMyAccount.styles';
import { formatNumberToUi } from '~lib/utils/numbers';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import Dashboard from '~app/components/applications/SSV/NewMyAccount/components/Dashboard/Dashboard';
import OperatorDetails from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';

const OperatorDashboard = ({ changeState }: { changeState: any }) => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const walletStore: WalletStore = stores.Wallet;
  const operatorStore: OperatorStore = stores.Operator;
  const myAccountStore: MyAccountStore = stores.MyAccount;

  const moveToRegisterOperator = () => {
    navigate(config.routes.SSV.OPERATOR.HOME);
  };

  const createData = (
      operatorName: JSX.Element,
      status: JSX.Element,
      performance: string,
      balance: JSX.Element,
      yearlyFee: JSX.Element,
      validators: number,
  ) => {
    return { operatorName, status, performance, balance, yearlyFee, validators };
  };

  const rows = myAccountStore.ownerAddressOperators.map((operator: any) => {
    return createData(
        <OperatorDetails operator={operator}/>,
        <Status status={operator.status}/>,
        `${operator.performance['30d']}%`,
        <SsvAndSubTitle ssv={10} subText={'~$77.5'} leftTextAlign/>,
        <SsvAndSubTitle ssv={formatNumberToUi(walletStore.fromWei(operator.fee) * config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR)} subText={'~$77.5'} leftTextAlign/>,
        operator.validators_count,
    );
  });

  const openSingleOperator = (listIndex: number) => {
    operatorStore.processOperatorId = myAccountStore.ownerAddressOperators[listIndex].id;
    navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.ROOT);
  };

  return (
    <Grid container className={classes.MyAccountWrapper}>
      <Grid container item className={classes.HeaderWrapper}>
        <Grid container item xs style={{ cursor: 'pointer' }}>
          <Typography className={classes.Header} onClick={() => changeState(1)}>Operator</Typography>
          <Grid className={classes.Arrow}/>
        </Grid>
        <Grid container item xs className={classes.HeaderButtonsWrapper}>
          <Grid item className={classes.HeaderButton} onClick={moveToRegisterOperator}>Add Operator</Grid>
        </Grid>
      </Grid>
      <Dashboard
          rows={rows}
          rowsAction={openSingleOperator}
          columns={[
            { name: 'Operator Name' },
            { name: 'Status', tooltip: 'Performance' },
            { name: 'Performance' },
            { name: 'Balance' },
            { name: 'Yearly Fee' },
            { name: 'Validators' },
          ]}
      />
    </Grid>
  );
};

export default observer(OperatorDashboard);
