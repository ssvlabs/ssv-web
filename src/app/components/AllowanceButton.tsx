import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useStores } from '~app/hooks/useStores';
import { translations } from '~app/common/config';
import CheckBox from '~app/components/common/CheckBox';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import { useStyles } from '~app/components/common/Button/Button.styles';
import { toWei } from '~root/services/conversions.service';
import { setIsShowTxPendingPopup, setTxHash } from '~app/redux/appState.slice';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import notifyService from '~root/services/notify.service';
import Spinner from '~app/components/common/Spinner';
import { getAccountAddress } from '~app/redux/wallet.slice';
import styled from 'styled-components';
import PrimaryButton from '~app/atomics/PrimaryButton';
import { ButtonSize } from '~app/enums/Button.enum';

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const ButtonWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 24px;
`;

const ProgressStepsWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
`;

const ProgressStepsInner = styled.div`
    display: flex;
    flex-direction: row;
`;

type ButtonParams = {
  text: string,
  disable: boolean,
  onClick?: any,
  testId?: string,
  errorButton?: boolean,
  withAllowance?: boolean,
  checkboxText?: string | null,
  checkBoxCallBack?: (() => void) | null,
  isCheckboxChecked?: boolean,
  isLoading?: boolean,
  totalAmount?: string,
  allowanceApprovedCB?: () => void
};

const AllowanceButton = ({
                           disable,
                           onClick,
                           text,
                           checkboxText,
                           checkBoxCallBack,
                           isCheckboxChecked,
                           totalAmount,
                           isLoading,
                           allowanceApprovedCB,
                         }: ButtonParams) => {
  const [hasCheckedAllowance, setHasCheckedAllowance] = useState(false);
  const [hasToRequestApproval, setHasToRequestApproval] = useState(false);
  const [hasGotAllowanceApproval, setHasGotAllowanceApproval] = useState(false);
  const [approveButtonText, setApproveButtonText] = useState('Approve SSV');
  const [allowanceButtonDisable, setAllowanceButtonDisable] = useState(false);
  const dispatch = useAppDispatch();
  const accountAddress = useAppSelector(getAccountAddress);
  const classes = useStyles();
  const stores = useStores();
  const ssvStore: SsvStore = stores.SSV;

  useEffect(() => {
    const checkUserAllowance = async () => {
      await ssvStore.checkAllowance();
      if (ssvStore.approvedAllowance < Number(toWei(totalAmount))) {
        setHasToRequestApproval(true);
        setHasGotAllowanceApproval(false);
      } else {
        setHasToRequestApproval(false);
      }
      setHasCheckedAllowance(true);
    };
    if (true) {
      checkUserAllowance();
    } else {
      setHasCheckedAllowance(true);
    }
  }, [totalAmount]);

  const handlePendingTransaction = ({ txHash }: { txHash: string }) => {
    dispatch(setTxHash(txHash));
    dispatch(setIsShowTxPendingPopup(true));
    notifyService.hash(txHash);
  };

  const requestAllowance = async () => {
    try {
      setAllowanceButtonDisable(true);
      setApproveButtonText('Approving…');
      await ssvStore.requestAllowance(handlePendingTransaction);
      setApproveButtonText('Approved');
      setHasGotAllowanceApproval(true);
      allowanceApprovedCB && allowanceApprovedCB();
    } catch (e) {
      console.error('Error while approving allowance', e);
      setApproveButtonText('Approve SSV');
    } finally {
      setAllowanceButtonDisable(false);
      dispatch(setIsShowTxPendingPopup(false));
    }
  };

  const regularButton = () => {
    return (
      <PrimaryButton
        isDisabled={disable}
        isLoading={isLoading}
        onClick={onClick ? onClick : () => {
        }}
        text={!!accountAddress ? text : translations.CTA_BUTTON.CONNECT}
        size={ButtonSize.XL}
      />
    );
  };

  const userNeedApproval = () => {
    return (
      <Container>
        <ButtonWrapper>
            <PrimaryButton
              text={approveButtonText}
              isDisabled={hasGotAllowanceApproval || disable}
              onClick={() => {
                !allowanceButtonDisable && requestAllowance();
              }}
              size={ButtonSize.XL}
            />
            <PrimaryButton
              isDisabled={!hasGotAllowanceApproval || disable}
              isLoading={isLoading}
              onClick={onClick ? onClick : () => {
              }}
              text={!!accountAddress ? text : translations.CTA_BUTTON.CONNECT}
             size={ButtonSize.XL}/>
        </ButtonWrapper>
          <ProgressStepsWrapper>
            <ProgressStepsInner>
            <Grid item
                  className={`${classes.Step} ${classes.Current} ${hasGotAllowanceApproval ? classes.Finish : ''}`}>
              {!hasGotAllowanceApproval && <Typography className={classes.StepText}>1</Typography>}
            </Grid>
            <Grid item xs className={`${classes.Line} ${hasGotAllowanceApproval ? classes.Finish : ''}`}/>
            <Grid item className={`${classes.Step} ${hasGotAllowanceApproval ? classes.Current : ''}`}>
              <Typography className={classes.StepText}>2</Typography>
            </Grid>
            </ProgressStepsInner>
          </ProgressStepsWrapper>
      </Container>
    );
  };

  if (!hasCheckedAllowance) {
    return <Grid alignContent="center" justifyContent="center"><Spinner size={35}/></Grid>;
  }

  return (
    <Grid container>
      {checkboxText && checkBoxCallBack && (
        <Grid item xs={12}>
          <CheckBox toggleIsChecked={checkBoxCallBack} text={checkboxText} isChecked={isCheckboxChecked}/>
        </Grid>
      )}
      {hasToRequestApproval ? userNeedApproval() : regularButton()}
    </Grid>
  );
};

export default observer(AllowanceButton);
