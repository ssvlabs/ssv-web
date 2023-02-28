import _ from 'underscore';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import Status from '~app/components/common/Status';
import { useStyles } from '../../NewMyAccount.styles';
import { formatNumberToUi } from '~lib/utils/numbers';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import Dashboard from '~app/components/applications/SSV/NewMyAccount/components/Dashboard';
import OperatorDetails from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';
import ToggleDashboards
  from '~app/components/applications/SSV/NewMyAccount/components/ToggleDashboards/ToggleDashboards';

const OperatorDashboard = ({ changeState }: { changeState: any }) => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const walletStore: WalletStore = stores.Wallet;
  const processStore: ProcessStore = stores.Process;
  const operatorStore: OperatorStore = stores.Operator;
  const myAccountStore: MyAccountStore = stores.MyAccount;
  const [loadingOperators, setLoadingOperators] = useState(true);
  const { page, pages, per_page, total } = myAccountStore.ownerAddressOperatorsPagination;
  loadingOperators;

  useEffect(() => {
    myAccountStore.ownerAddressOperators.forEach((operator: any, index: number) => {
      operatorStore.getOperatorBalance(operator.id).then((balance) => {
        operator.balance = balance;
        const newOperatorsList = myAccountStore.ownerAddressOperators;
        delete newOperatorsList[index];
        newOperatorsList.push(operator);
        myAccountStore.ownerAddressOperators = newOperatorsList;
      });
    });
  }, [page]);

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
        <OperatorDetails operator={operator} />,
        <Status item={operator}/>,
        `${operator.performance['30d'] === 0 ? '-' : `${operator.performance['30d']  }%`}`,
        <SsvAndSubTitle ssv={operator.balance ? formatNumberToUi(operator.balance) : 'place holder'} subText={'~$77.5'}
                        leftTextAlign/>,
        <SsvAndSubTitle
            ssv={formatNumberToUi(walletStore.fromWei(operator.fee) * config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR)}
            subText={'~$77.5'} leftTextAlign />,
        operator.validators_count,
    );
  });

  const openSingleOperator = (listIndex: number) => {
    processStore.setProcess({
      processName: 'single_operator',
      item: myAccountStore.ownerAddressOperators[listIndex],
    }, 1);
    operatorStore.processOperatorId = myAccountStore.ownerAddressOperators[listIndex].id;
    navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.ROOT);
  };

  const onChangePage = _.debounce( async (newPage: number) =>  {
    setLoadingOperators(true);
    await myAccountStore.getOwnerAddressOperators({ forcePage: newPage });
    setLoadingOperators(false);
  }, 200);

  return (
    <Grid container className={classes.MyAccountWrapper}>
      <Grid container item className={classes.HeaderWrapper}>
        <ToggleDashboards changeState={changeState} title={'Operators'} type={'operator'} />
        <Grid container item xs className={classes.HeaderButtonsWrapper}>
          <Grid item className={classes.HeaderButton} onClick={moveToRegisterOperator}>Add Operator</Grid>
        </Grid>
      </Grid>
      <Dashboard
          disable
          rows={rows}
          rowsAction={openSingleOperator}
          paginationActions={{
            page,
            count: total,
            totalPages: pages,
            rowsPerPage: per_page,
            onChangePage: onChangePage,
          }}
          columns={[
            { name: 'Operator Name' },
            { name: 'Status', tooltip: 'Performance' },
            { name: '30D Performance' },
            { name: 'Balance' },
            { name: 'Yearly Fee' },
            { name: 'Validators' },
          ]}
      />
    </Grid>
  );
};

export default observer(OperatorDashboard);
