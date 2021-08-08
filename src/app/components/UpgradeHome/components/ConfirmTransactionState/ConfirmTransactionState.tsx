import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useStores } from '~app/hooks/useStores';
import { formatFloatToMaxPrecision } from '~lib/utils/numbers';
import ProgressStepper from '~app/common/components/ProgressStepper';
import NotificationsStore from '~app/common/stores/Notifications.store';
import UpgradeStore, { UpgradeSteps } from '~app/common/stores/Upgrade.store';
import { ActionButton } from '~app/components/UpgradeHome/components/ConversionState/ConversionState';
import { useStyles } from '~app/components/UpgradeHome/components/ConversionState/ConversionState.styles';

const ConfirmTransactionInfoRow = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  color: #5B6C84;
  padding-top: 5px;
  padding-bottom: 5px;
`;

const ConfirmTransactionInfoLabel = styled.div`
  margin-left: 0;
  margin-right: auto;
`;

const ConfirmTransactionInfo = styled.div`
  margin-right: 0;
  margin-left: auto;
`;

const CustomCheckbox = styled(Checkbox)`
  &.Mui-checked {
    color: #5B6C84;
  }
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 0;

  & > ${ActionButton} {
    width: calc(50% - 15px);

    &:first-child {
      margin-left: 0;
      margin-right: 15px;
    }

    &:last-child {
      margin-left: auto;
      margin-right: 0;
    }
  }
`;

const ApprovingProgress = styled(CircularProgress)`
  color: #5B6C84;
  position: absolute;
  right: 20px;
`;

const ConfirmTransactionState = () => {
  const classes = useStyles();
  const stores = useStores();
  const upgradeStore: UpgradeStore = stores.Upgrade;
  const notificationsStore: NotificationsStore = stores.Notifications;

  // Process states
  const [approving, setApproving] = useState(false);
  const [upgraded, setUpgraded] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [allowanceApproved, setAllowanceApproved] = useState(false);
  const [insufficientSsvContractBalance, setInsufficientSsvContractBalance] = useState(false);
  const [checkingSsvContractBalance, setCheckingSsvContractBalance] = useState(false);
  const [checkingAllowance, setCheckingAllowance] = useState(false);
  const [checkboxDisabled, setCheckboxDisabled] = useState(false);

  // Button states
  const [checkboxChecked, setCheckboxChecked] = useState(upgradeStore.isUserAgreedOnTerms);
  const [approveButtonDisabled, setApproveButtonDisabled] = useState(true);
  const [twoStepsUpgradeButtonDisabled, setTwoStepsUpgradeButtonDisabled] = useState(true);
  const [oneStepUpgradeButtonDisabled, setOneStepUpgradeButtonDisabled] = useState(true);

  const onCheckboxChange = (event: any) => {
    setCheckboxChecked(event.target.checked);
  };

  const navigateToDisclaimer = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    upgradeStore.setStep(UpgradeSteps.disclaimer);
  };

  /**
   * Call approve allowance with estimation or in real.
   * @param estimate
   */
  const approveAllowance = (estimate: boolean = false) => {
    if (!estimate) {
      setApproving(true);
    }
    return upgradeStore.approveAllowance(undefined, estimate).then((estimation: number) => {
      if (!estimate) {
        setAllowanceApproved(true);
      }
      return estimation;
    }).catch((error: any) => {
      if (!estimate) {
        console.error('Approving allowance error:', error);
        notificationsStore.showMessage(error.message, 'error');
        setAllowanceApproved(false);
      }
    }).finally(() => {
      if (!estimate) {
        setApproving(false);
      }
    });
  };

  /**
   * Upgrade CDT to SSV - estimation and real modes.
   * @param estimate
   */
  const upgradeCdtToSsv = (estimate: boolean = false) => {
    if (!estimate) {
      setUpgrading(true);
    }
    return upgradeStore.convertCdtToSsv(estimate).then((result: any) => {
      if (!estimate) {
        console.debug('Conversion result:', result);
        setUpgraded(true);
        upgradeStore.setStep(UpgradeSteps.upgradeSuccess);
        upgradeStore.setUpgradeTxHash(result.transactionHash);
      }
      return result;
    }).catch((error: any) => {
      console.error('Upgrading Error:', error);
      if (!estimate) {
        notificationsStore.showMessage(error.message, 'error');
      }
    }).finally(() => {
      if (!estimate) {
        setUpgrading(false);
      }
    });
  };

  /**
   * Approve button states
   * @param props
   */
  const renderApproveButtonText = (props: { approving: boolean, approved: boolean }) => {
    // eslint-disable-next-line react/prop-types
    if (props.approved) {
      return 'Approved';
    }
    // eslint-disable-next-line react/prop-types
    if (props.approving) {
      return (
        <>
          Approving... <ApprovingProgress size={20} />
        </>
      );
    }
    return 'Approve';
  };

  /**
   * Upgrade button states
   * @param props
   */
  const renderUpgradeButtonText = (props: { upgrading: boolean, upgraded: boolean }) => {
    if (insufficientSsvContractBalance) {
      return 'Insufficient SSV balance in upgrade contract';
    }
    // eslint-disable-next-line react/prop-types
    if (props.upgraded) {
      return 'Upgraded';
    }
    // eslint-disable-next-line react/prop-types
    if (props.upgrading) {
      return (
        <>
          Upgrading... <ApprovingProgress size={20} />
        </>
      );
    }
    return 'Upgrade';
  };

  /**
   * Check allowance for user.
   */
  const checkAllowance = () => {
    setCheckingAllowance(true);
    upgradeStore.checkAllowance().then((allowance: any) => {
      console.debug('User Allowance Value:', allowance);
      setCheckingAllowance(false);
      return allowance;
    });
  };

  /**
   * Check contract balance of SSV tokens.
   */
  const checkSsvContractBalance = () => {
    setCheckingSsvContractBalance(true);
    upgradeStore.getSsvContractBalance().then((ssvBalance: any) => {
      setInsufficientSsvContractBalance(!ssvBalance);
      setCheckingSsvContractBalance(false);
      return ssvBalance;
    });
  };

  // Allowance effect
  useEffect(() => {
    if (upgradeStore.approvedAllowance === null) {
      checkAllowance();
    }
    if (upgradeStore.ssvContractBalance === null) {
      checkSsvContractBalance();
    }
  }, [upgradeStore.approvedAllowance, upgradeStore.ssvContractBalance]);

  // Buttons states
  useEffect(() => {
    setCheckboxDisabled(upgrading || approving || checkingSsvContractBalance || insufficientSsvContractBalance);
    setApproveButtonDisabled(!checkboxChecked || allowanceApproved || approving);
    setTwoStepsUpgradeButtonDisabled(!allowanceApproved || !checkboxChecked || upgraded || upgrading || checkingSsvContractBalance || insufficientSsvContractBalance);
    setOneStepUpgradeButtonDisabled(!checkboxChecked || upgraded || upgrading || checkingSsvContractBalance || insufficientSsvContractBalance);
  }, [
    checkboxChecked, allowanceApproved, approving, upgraded,
    upgrading, checkingSsvContractBalance, insufficientSsvContractBalance,
  ]);

  const renderActionButtons = () => {
    const upgradeButton = (
      <ActionButton
        disabled={oneStepUpgradeButtonDisabled}
        onClick={() => upgradeCdtToSsv()}
      >
        {renderUpgradeButtonText({ upgrading, upgraded })}
      </ActionButton>
    );

    if (checkingSsvContractBalance || checkingAllowance) {
      return '';
    }

    if (insufficientSsvContractBalance) {
      return upgradeButton;
    }

    if (upgradeStore.approvedAllowance !== null && !upgradeStore.approvedAllowance) {
      return (
        <>
          <ActionButtonsContainer>
            <ActionButton
              disabled={approveButtonDisabled}
              onClick={() => approveAllowance()}
            >
              {renderApproveButtonText({ approving, approved: allowanceApproved })}
            </ActionButton>
            <ActionButton
              disabled={twoStepsUpgradeButtonDisabled}
              onClick={() => upgradeCdtToSsv()}
            >
              {renderUpgradeButtonText({ upgrading, upgraded })}
            </ActionButton>
          </ActionButtonsContainer>

          <ProgressStepper
            step={!allowanceApproved ? 1 : 2}
            steps={2}
            done={upgraded}
          />
        </>
      );
    }
    return upgradeButton;
  };

  return (
    <Grid container spacing={0} justify="center" className={classes.root}>
      <Grid item xs={12} md={12} lg={12}>
        <ConfirmTransactionInfoRow>
          <ConfirmTransactionInfoLabel>From</ConfirmTransactionInfoLabel>
          <ConfirmTransactionInfo>{upgradeStore.cdtValue} CDT</ConfirmTransactionInfo>
        </ConfirmTransactionInfoRow>

        <ConfirmTransactionInfoRow>
          <ConfirmTransactionInfoLabel>To</ConfirmTransactionInfoLabel>
          <ConfirmTransactionInfo>{formatFloatToMaxPrecision(upgradeStore.ssvValue)} SSV</ConfirmTransactionInfo>
        </ConfirmTransactionInfoRow>

        <ConfirmTransactionInfoRow>
          <ConfirmTransactionInfoLabel>Rate</ConfirmTransactionInfoLabel>
          <ConfirmTransactionInfo>1 SSV = 100 CDT</ConfirmTransactionInfo>
        </ConfirmTransactionInfoRow>

        <ConfirmTransactionInfoRow style={{ padding: 20 }} />

        <InputLabel style={{ width: '100%' }}>
          <CustomCheckbox
            checked={checkboxChecked}
            onChange={onCheckboxChange}
            color="primary"
            style={{ padding: 0, marginRight: 10 }}
            disabled={checkboxDisabled}
          />
          I acknowledge that I read and understood the upgrade <a href="/" onClick={navigateToDisclaimer}>disclaimer</a>
        </InputLabel>
        <ConfirmTransactionInfoRow style={{ padding: 5 }} />

        {renderActionButtons()}
      </Grid>
    </Grid>
  );
};

export default observer(ConfirmTransactionState);
