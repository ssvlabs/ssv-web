import Grid from '@mui/material/Grid';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { NewValidatorRouteState } from '~app/Routes';
import { PrimaryButton } from '~app/atomicComponents';
import config from '~app/common/config';
import Balance from '~app/components/applications/SSV/MyAccount/components/Balance';
import OperatorBox from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/OperatorBox';
import ActionsButton from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/actions/ActionsButton';
import ValidatorsList from '~app/components/applications/SSV/MyAccount/components/Validator/ValidatorsList/ValidatorsList';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import { Tooltip } from '~app/components/ui/tooltip';
import { ButtonSize } from '~app/enums/Button.enum';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import useValidatorRegistrationFlow from '~app/hooks/useValidatorRegistrationFlow';
import { getSelectedCluster, setExcludedCluster, setSelectedClusterId } from '~app/redux/account.slice';
import { getIsDarkMode } from '~app/redux/appState.slice';
import { selectOperators } from '~app/redux/operator.slice.ts';
import { getAccountAddress } from '~app/redux/wallet.slice';
import { canAccountUseOperator } from '~lib/utils/operatorMetadataHelper';
import { useStyles } from './SingleCluster.styles';

const ValidatorsWrapper = styled.div`
  width: 872px;
  max-height: 700px;
  padding: 28px 32px 32px 32px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.white};
  margin-bottom: 24px;
`;

const Section = styled.div`
  gap: 24px;
  width: 1320px;
  margin: 32px auto auto;
  display: flex;
  flex-direction: row;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const ValidatorsCountBadge = styled.div`
  height: 30px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.gray10};
  padding: 3px 12px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray60};
`;

const SingleCluster = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cluster = useAppSelector(getSelectedCluster);
  const isDarkMode = useAppSelector(getIsDarkMode);
  const accountAddress = useAppSelector(getAccountAddress);

  const { data: hasPrivateOperators } = useQuery({
    queryKey: ['has-private-operators', cluster.operators, accountAddress],
    queryFn: async () => {
      const result = await Promise.all(cluster.operators.map((operator) => canAccountUseOperator(accountAddress, operator)));
      return result.some((isUsable) => isUsable === false);
    }
  });

  const hasDeletedOperators = cluster.operators.some((operator) => operator.is_deleted);

  const canAddValidator = !hasDeletedOperators && !cluster.isLiquidated && !hasPrivateOperators;
  const { getNextNavigation } = useValidatorRegistrationFlow(window.location.pathname);

  const getTooltipContent = () => {
    if (cluster.isLiquidated) return 'You cannot perform this operation when your cluster is liquidated. Please reactivate to proceed.';
    if (hasDeletedOperators) return `One of your chosen operators has been removed by its owner. To onboard validators, you'll need to select a new cluster.`;
    if (hasPrivateOperators) return `One of your chosen operators has shifted to a permissioned status. To onboard validators, you'll need to select a new cluster.`;
  };

  const addToCluster = () => {
    dispatch(selectOperators(cluster.operators));
    navigate(getNextNavigation(), { state: { newValidatorDepositAmount: 0 } satisfies NewValidatorRouteState });
  };

  const backToClustersDashboard = () => {
    dispatch(setSelectedClusterId(undefined));
    dispatch(setExcludedCluster(null));
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD);
  };

  const moveToReactivateCluster = () => {
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.REACTIVATE);
  };

  const moveToDeposit = () => {
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.DEPOSIT);
  };

  const moveToWithdraw = () => {
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.WITHDRAW);
  };

  return (
    <Grid container className={classes.Wrapper}>
      <NewWhiteWrapper stepBack={backToClustersDashboard} type={0} header={'Cluster'} />
      <Grid container item className={classes.Section}>
        {cluster.operators.map((operator, index) => (
          <OperatorBox key={index} operator={operator} />
        ))}
      </Grid>
      <Section>
        <Grid item>
          <Balance
            cluster={cluster}
            hasPrivateOperators={hasPrivateOperators || false}
            moveToReactivateCluster={moveToReactivateCluster}
            moveToDeposit={moveToDeposit}
            moveToWithdraw={moveToWithdraw}
          />
        </Grid>
        <div>
          <ValidatorsWrapper>
            <Grid container className={classes.HeaderWrapper}>
              <TitleWrapper>
                <Grid item className={classes.Header}>
                  Validators
                </Grid>
                {cluster.validatorCount > 0 && <ValidatorsCountBadge>{cluster.validatorCount}</ValidatorsCountBadge>}
              </TitleWrapper>
              <Grid className={classes.ButtonsWrapper}>
                {cluster.validatorCount > 1 && <ActionsButton />}
                <Tooltip content={getTooltipContent()}>
                  <PrimaryButton
                    isDisabled={!canAddValidator}
                    text={'Add Validator'}
                    icon={`/images/plusIcon/plus${isDarkMode ? '-dark' : ''}.svg`}
                    size={ButtonSize.SM}
                    onClick={addToCluster}
                  />
                </Tooltip>
              </Grid>
            </Grid>
            <ValidatorsList />
          </ValidatorsWrapper>
        </div>
      </Section>
    </Grid>
  );
};

export default observer(SingleCluster);
