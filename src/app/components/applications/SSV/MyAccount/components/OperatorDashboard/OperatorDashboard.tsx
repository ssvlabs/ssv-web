import _ from 'underscore';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import Status from '~app/components/common/Status';
import { useStyles } from '../../MyAccount.styles';
import { formatNumberToUi } from '~lib/utils/numbers';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import Dashboard from '~app/components/applications/SSV/MyAccount/components/Dashboard';
import ToggleDashboards
  from '~app/components/applications/SSV/MyAccount/components/ToggleDashboards/ToggleDashboards';
import OperatorDetails
  from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';

const OperatorDashboard = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const ssvStore: SsvStore = stores.SSV;
  const walletStore: WalletStore = stores.Wallet;
  const processStore: ProcessStore = stores.Process;
  const operatorStore: OperatorStore = stores.Operator;
  const myAccountStore: MyAccountStore = stores.MyAccount;
  const [openExplorerRefs, setOpenExplorerRefs] = useState<any[]>([]);
  const [operatorBalances, setOperatorBalances] = useState({});
  const [loadingOperators, setLoadingOperators] = useState(false);
  const { page, pages, per_page, total } = myAccountStore.ownerAddressOperatorsPagination;

  useEffect(() => {
    const fetchData = async () => {
      for (const operator of myAccountStore.ownerAddressOperators) {
        const balance = await operatorStore.getOperatorBalance(operator.id);
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        setOperatorBalances((prevState: {}) => ({ ...prevState, [operator.id]: balance }));
      }
    };
    fetchData();
  }, [page]);

  useEffect(() => {
  }, [operatorBalances]);

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
        <OperatorDetails operator={operator} setOpenExplorerRefs={setOpenExplorerRefs} />,
        <Status item={operator} />,
        `${operator.performance['30d'] === 0 ? '-' : `${operator.performance['30d']  }%`}`,
        // @ts-ignore
        <SsvAndSubTitle ssv={operatorBalances[operator.id] === undefined ?  'n/a' : formatNumberToUi(operatorBalances[operator.id])} leftTextAlign />,
        <SsvAndSubTitle
            ssv={formatNumberToUi(ssvStore.newGetFeeForYear(walletStore.fromWei(operator.fee)))} leftTextAlign />,
        operator.validators_count,
    );
  });

  const openSingleOperator = (listIndex: number, e: any) => {
    if ( openExplorerRefs.includes(e.target) ){
      return;
    }
    const operator = myAccountStore.ownerAddressOperators[listIndex];
    processStore.setProcess({
      processName: 'single_operator',
      // @ts-ignore
      item: { ...operator, balance: operatorBalances[operator.id] },
    }, 1);
    operatorStore.processOperatorId = myAccountStore.ownerAddressOperators[listIndex].id;
    navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.ROOT);
  };

  const onChangePage = _.debounce( async (newPage: number) =>  {
    setLoadingOperators(true);
    await myAccountStore.getOwnerAddressOperators({ forcePage: newPage });
    setLoadingOperators(false);
  }, 200);
  
  const sortByStatus = (arr: any) => {
    return arr.sort((a: any, b: any) => {
      if (a.status === 'Inactive') {
        return -1;
      } else if (b.status === 'Inactive') {
        return 1;
      } else if (a.status === 'Active') {
        return b.status === 'No Validators' ? -1 : -1;
      } else {
        return b.status === 'No Validators' ? 0 : 1;
      }
    });
  };


  const sortOperatorsByStatus = () => {
    const newOperatorsList = [...myAccountStore.ownerAddressOperators];
    myAccountStore.ownerAddressOperators = sortByStatus(newOperatorsList);
  };

  return (
    <Grid container className={classes.MyAccountWrapper}>
      <Grid container item className={classes.HeaderWrapper}>
        <ToggleDashboards title={'Operators'} type={'operator'} />
        <Grid container item xs className={classes.HeaderButtonsWrapper}>
          <Grid item className={classes.HeaderButton} onClick={moveToRegisterOperator}>Add Operator</Grid>
        </Grid>
      </Grid>
      <Dashboard
          disable
          rows={rows}
          loading={loadingOperators}
          noItemsText={'Seems that you have no operators click "Add Operator" in order to run first SSV operator'}
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
            { name: 'Status', onClick: sortOperatorsByStatus, tooltip: 'Is the operator performing duties for the majority of its validators for the last 2 epochs.' },
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
