import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PrimaryButton } from '~app/atomicComponents';
import config from '~app/common/config';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import Balance from '~app/components/applications/SSV/MyAccount/components/Balance';
import OperatorBox from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/OperatorBox';
import ActionsButton from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/actions/ActionsButton';
import ValidatorsList from '~app/components/applications/SSV/MyAccount/components/Validator/ValidatorsList/ValidatorsList';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import AnchorTooltip from '~app/components/common/ToolTip/components/AnchorTooltip/AnchorTooltIp';
import { ButtonSize } from '~app/enums/Button.enum';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { useStores } from '~app/hooks/useStores';
import useValidatorRegistrationFlow from '~app/hooks/useValidatorRegistrationFlow';
import { SingleCluster as SingleClusterProcess } from '~app/model/processes.model';
import { getSelectedCluster, setSelectedClusterId } from '~app/redux/account.slice';
import { getIsDarkMode } from '~app/redux/appState.slice';
import { getAccountAddress } from '~app/redux/wallet.slice';
import { isEqualsAddresses } from '~lib/utils/strings';
import { useStyles } from './SingleCluster.styles';
import { selectOperators } from '~app/redux/operator.slice.ts';

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
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const processStore: ProcessStore = stores.Process;
  const process: SingleClusterProcess = processStore.getProcess;
  const cluster = useAppSelector(getSelectedCluster);
  const isDarkMode = useAppSelector(getIsDarkMode);
  const accountAddress = useAppSelector(getAccountAddress);

  const hasPrivateOperator = cluster.operators.some(
    (operator: any) =>
      operator.address_whitelist &&
      !isEqualsAddresses(operator.address_whitelist, accountAddress) &&
      operator.address_whitelist !== config.GLOBAL_VARIABLE.DEFAULT_ADDRESS_WHITELIST
  );
  const showAddValidatorBtnCondition = cluster.operators.some((operator: any) => operator.is_deleted) || cluster.isLiquidated || hasPrivateOperator;
  const { getNextNavigation } = useValidatorRegistrationFlow(window.location.pathname);

  const addToCluster = () => {
    process.processName = 'cluster_registration';
    // @ts-ignore
    process.registerValidator = { depositAmount: 0 };
    console.log(cluster.operators);
    dispatch(selectOperators(cluster.operators));
    navigate(getNextNavigation());
  };

  const backToClustersDashboard = () => {
    dispatch(setSelectedClusterId(''));
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
        {cluster.operators.map((operator: any, index: number) => {
          return <OperatorBox key={index} operator={operator} />;
        })}
      </Grid>
      <Section>
        <Grid item>
          <Balance cluster={cluster} moveToReactivateCluster={moveToReactivateCluster} moveToDeposit={moveToDeposit} moveToWithdraw={moveToWithdraw} />
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
                <AnchorTooltip
                  title={"One of your chosen operators has shifted to a permissioned status. To onboard validators, you'll need to select a new cluster."}
                  shouldDisableHoverListener={!hasPrivateOperator}
                  placement="top"
                >
                  <div>
                    <PrimaryButton
                      isDisabled={showAddValidatorBtnCondition}
                      text={'Add Validator'}
                      icon={`/images/plusIcon/plus${isDarkMode ? '-dark' : ''}.svg`}
                      size={ButtonSize.SM}
                      onClick={addToCluster}
                    />
                  </div>
                </AnchorTooltip>
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
