import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import Status from '~app/components/common/Status';
import { formatNumberToUi } from '~lib/utils/numbers';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import { useStyles } from '~app/components/applications/SSV/MyAccount/MyAccount.styles';
import Dashboard from '~app/components/applications/SSV/MyAccount/components/Dashboard';
import ToggleDashboards
  from '~app/components/applications/SSV/MyAccount/components/ToggleDashboards/ToggleDashboards';
import OperatorDetails
  from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';
import { fromWei, getFeeForYear } from '~root/services/conversions.service';
import { IOperator } from '~app/model/operator.model';
import { setMessageAndSeverity } from '~app/redux/notifications.slice';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { getOperatorBalance } from '~root/services/operatorContract.service';
import { fetchOperators, getAccountOperators, getOperatorsPagination, setSelectedOperatorId, sortOperatorsByStatus } from '~app/redux/account.slice';

const OperatorDashboard = () => {
  const stores = useStores();
  const classes = useStyles({});
  const navigate = useNavigate();
  const processStore: ProcessStore = stores.Process;
  const operatorStore: OperatorStore = stores.Operator;
  const dispatch = useAppDispatch();
  const [openExplorerRefs, setOpenExplorerRefs] = useState<any[]>([]);
  const [operatorBalances, setOperatorBalances] = useState({});
  const [loadingOperators, setLoadingOperators] = useState(false);
  const { page, pages, per_page, total } = useAppSelector(getOperatorsPagination);
  const operators = useAppSelector(getAccountOperators);

  const fetchData = async () => {
    try {
      const promises = operators.map((operator: IOperator) => new Promise(async () => {
        const balance = await getOperatorBalance({ id: operator.id });
        setOperatorBalances((prevState: {}) => ({ ...prevState, [operator.id]: balance }));
      }));
      await Promise.all(promises);
    } catch (e: any) {
      dispatch(setMessageAndSeverity({ message: e.message, severity: 'error' }));
    }
  };

  useEffect(() => {
    fetchData();
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

  const rows = operators.map((operator: any) => {
    return createData(
        <OperatorDetails operator={operator} setOpenExplorerRefs={setOpenExplorerRefs} />,
        <Status item={operator} />,
        `${operator.validators_count === 0 ? '- -' : `${operator.performance['30d'].toFixed(2)  }%`}`,
        // @ts-ignore
        <SsvAndSubTitle ssv={operatorBalances[operator.id] === undefined ?  'n/a' : formatNumberToUi(operatorBalances[operator.id])} leftTextAlign />,
        <SsvAndSubTitle
            ssv={formatNumberToUi(getFeeForYear(fromWei(operator.fee)))} leftTextAlign />,
        operator.validators_count,
    );
  });

  const openSingleOperator = (listIndex: number, e: any) => {
    if (openExplorerRefs.includes(e.target)){
      return;
    }
    const operator = operators[listIndex];
    processStore.setProcess({
      processName: 'single_operator',
      // @ts-ignore
      item: { ...operator, balance: operatorBalances[operator.id] },
    }, 1);
    operatorStore.processOperatorId = operators[listIndex].id;
    dispatch(setSelectedOperatorId(operators[listIndex].id));
    navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.ROOT);
  };

  const onChangePage = async (newPage: number) =>  {
    setLoadingOperators(true);
    await dispatch(fetchOperators({ forcePage: newPage }));
    setLoadingOperators(false);
  };

  const sortOperatorsByStatusHandler = () => {
    dispatch(sortOperatorsByStatus());
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
            { name: 'Status', onClick: sortOperatorsByStatusHandler, tooltip: 'Is the operator performing duties for the majority of its validators for the last 2 epochs.' },
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
