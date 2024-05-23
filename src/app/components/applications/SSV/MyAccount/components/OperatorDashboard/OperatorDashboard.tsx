import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import Status from '~app/components/common/Status';
import { formatNumberToUi } from '~lib/utils/numbers';
import SsvAndSubTitle from '~app/components/common/SsvAndSubTitle';
import { useStyles } from '~app/components/applications/SSV/MyAccount/MyAccount.styles';
import Dashboard from '~app/components/applications/SSV/MyAccount/components/Dashboard';
import ToggleDashboards from '~app/components/applications/SSV/MyAccount/components/ToggleDashboards/ToggleDashboards';
import OperatorDetails from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators/components/FirstSquare/components/OperatorDetails';
import { fromWei, getFeeForYear } from '~root/services/conversions.service';
import { IOperator } from '~app/model/operator.model';
import { setMessageAndSeverity } from '~app/redux/notifications.slice';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { getOperatorBalance } from '~root/services/operatorContract.service';
import { fetchOperators, getAccountOperators, getOperatorsPagination, setSelectedOperatorId, sortOperatorsByStatus } from '~app/redux/account.slice';
import { PrimaryButton } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum';
import { setOperatorProcessId } from '~app/redux/operator.slice.ts';
import { setProcessAndType } from '~app/redux/process.slice.ts';
import { ProcessType } from '~app/model/processes.model.ts';

const ButtonWrapper = styled.div`
  width: 164px;
`;

const OperatorDashboard = () => {
  const classes = useStyles({});
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [openExplorerRefs, setOpenExplorerRefs] = useState<any[]>([]);
  const [operatorBalances, setOperatorBalances] = useState<Record<string, number>>({});
  const [loadingOperators, setLoadingOperators] = useState(false);
  const { page, pages, per_page, total } = useAppSelector(getOperatorsPagination);
  const operators = useAppSelector(getAccountOperators);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      const promises = operators.map(
        (operator: IOperator) =>
          // eslint-disable-next-line no-async-promise-executor
          new Promise(async () => {
            const balance = await getOperatorBalance({ id: operator.id });
            setOperatorBalances((prevState: {}) => ({ ...prevState, [operator.id]: balance }));
          })
      );
      await Promise.all(promises);
    } catch (e: any) {
      dispatch(setMessageAndSeverity({ message: e.message, severity: 'error' }));
    }
  };

  const moveToRegisterOperator = () => {
    navigate(config.routes.SSV.OPERATOR.HOME);
  };

  const createData = (operatorName: JSX.Element, status: JSX.Element, performance: string, balance: JSX.Element, yearlyFee: JSX.Element, validators: number) => {
    return { operatorName, status, performance, balance, yearlyFee, validators };
  };

  const rows = operators.map((operator: any) => {
    return createData(
      <OperatorDetails operator={operator} setOpenExplorerRefs={setOpenExplorerRefs} />,
      <Status item={operator} />,
      `${operator.validators_count === 0 ? '- -' : `${operator.performance['30d'].toFixed(2)}%`}`,
      <SsvAndSubTitle ssv={operatorBalances[operator.id] === undefined ? 'n/a' : formatNumberToUi(operatorBalances[operator.id])} leftTextAlign />,
      <SsvAndSubTitle ssv={formatNumberToUi(getFeeForYear(fromWei(operator.fee)))} leftTextAlign />,
      operator.validators_count
    );
  });

  const openSingleOperator = (listIndex: number, e: any) => {
    if (openExplorerRefs.includes(e.target)) {
      return;
    }
    const operator = operators[listIndex];
    dispatch(
      setProcessAndType({
        process: {
          processName: 'single_operator',
          item: { ...operator, balance: operatorBalances[operator.id] }
        },
        type: ProcessType.Operator
      })
    );
    dispatch(setSelectedOperatorId(operators[listIndex].id));
    dispatch(setOperatorProcessId(operators[listIndex].id));
    navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.ROOT);
  };

  const onChangePage = async (newPage: number) => {
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
        <ButtonWrapper>
          <PrimaryButton size={ButtonSize.MD} text={'Add Operator'} onClick={moveToRegisterOperator} />
        </ButtonWrapper>
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
          onChangePage: onChangePage
        }}
        columns={[
          { name: 'Operator Name' },
          {
            name: 'Status',
            onClick: sortOperatorsByStatusHandler,
            tooltip: 'Is the operator performing duties for the majority of its validators for the last 2 epochs.'
          },
          { name: '30D Performance' },
          { name: 'Balance' },
          { name: 'Yearly Fee' },
          { name: 'Validators' }
        ]}
      />
    </Grid>
  );
};

export default observer(OperatorDashboard);
