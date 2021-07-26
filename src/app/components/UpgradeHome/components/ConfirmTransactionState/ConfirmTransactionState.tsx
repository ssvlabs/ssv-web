import React, { useState } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useStores } from '~app/hooks/useStores';
import ProgressStepper from '~app/common/components/ProgressStepper';
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
  const [approving, setApproving] = useState(false);
  const [upgraded, setUpgraded] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [transactionApproved, setTransactionApproved] = useState(false);

  const onCheckboxChange = (event: any) => {
    setCheckboxChecked(event.target.checked);
  };

  const navigateToDisclaimer = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    upgradeStore.setStep(UpgradeSteps.disclaimer);
  };

  const onApproveClick = () => {
    console.debug('TODO: approve action');
    // TODO: show spinner inside of the button
    setApproving(true);
    setTimeout(() => {
      setTransactionApproved(true);
      setApproving(false);
    }, 1000);
  };

  const onUpgradeClick = () => {
    // TODO: call upgrade function
    setUpgrading(true);
    setTimeout(() => {
      setUpgraded(true);
      upgradeStore.setStep(UpgradeSteps.upgradeSuccess);
    }, 1000);
  };

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

  const approveButtonDisabled = !checkboxChecked || transactionApproved || approving;
  const twoStepsUpgradeButtonDisabled = !transactionApproved || !checkboxChecked || upgraded || upgrading;
  const oneStepUpgradeButtonDisabled = !checkboxChecked || upgraded || upgrading;

  return (
    <Grid container spacing={0} justify="center" className={classes.root}>
      <Grid item xs={12} md={12} lg={12}>
        <ConfirmTransactionInfoRow>
          <ConfirmTransactionInfoLabel>From</ConfirmTransactionInfoLabel>
          <ConfirmTransactionInfo>{upgradeStore.cdtValue} CDT</ConfirmTransactionInfo>
        </ConfirmTransactionInfoRow>

        <ConfirmTransactionInfoRow>
          <ConfirmTransactionInfoLabel>To</ConfirmTransactionInfoLabel>
          <ConfirmTransactionInfo>{upgradeStore.ssvValue} SSV</ConfirmTransactionInfo>
        </ConfirmTransactionInfoRow>

        <ConfirmTransactionInfoRow>
          <ConfirmTransactionInfoLabel>Rate</ConfirmTransactionInfoLabel>
          <ConfirmTransactionInfo>1 CDT = 0.01 SSV</ConfirmTransactionInfo>
        </ConfirmTransactionInfoRow>

        <ConfirmTransactionInfoRow>
          <ConfirmTransactionInfoLabel>Transaction fee</ConfirmTransactionInfoLabel>
          <ConfirmTransactionInfo>x.xxx ETH <b>$x.xx</b></ConfirmTransactionInfo>
        </ConfirmTransactionInfoRow>

        <ConfirmTransactionInfoRow style={{ padding: 20 }} />

        <InputLabel style={{ width: '100%' }}>
          <CustomCheckbox
            checked={checkboxChecked}
            onChange={onCheckboxChange}
            color="primary"
            style={{ padding: 0, marginRight: 10 }}
          />
          I acknowledge that I read and understood the upgrade <a href="/" onClick={navigateToDisclaimer}>disclaimer</a>
        </InputLabel>
        <ConfirmTransactionInfoRow style={{ padding: 5 }} />

        {!upgradeStore.isApprovedAllowance ? (
          <>
            <ActionButtonsContainer>
              <ActionButton
                disabled={approveButtonDisabled}
                onClick={onApproveClick}
              >
                {renderApproveButtonText({ approving, approved: transactionApproved })}
              </ActionButton>
              <ActionButton
                disabled={twoStepsUpgradeButtonDisabled}
                onClick={onUpgradeClick}
              >
                Upgrade
              </ActionButton>
            </ActionButtonsContainer>

            <ProgressStepper
              step={!transactionApproved ? 1 : 2}
              steps={2}
              done={upgraded}
            />
          </>
        ) : (
          <ActionButton
            disabled={oneStepUpgradeButtonDisabled}
            onClick={onUpgradeClick}
          >
            Upgrade
          </ActionButton>
        )}
      </Grid>
    </Grid>
  );
};

export default observer(ConfirmTransactionState);
