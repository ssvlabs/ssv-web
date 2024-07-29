import { useEffect, useState } from 'react';
import { translations } from '~app/common/config';
import CheckBox from '~app/components/common/CheckBox';
import { toWei } from '~root/services/conversions.service';
import { setIsShowTxPendingPopup, setTxHash } from '~app/redux/appState.slice';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import notifyService from '~root/services/notify.service';
import Spinner from '~app/components/common/Spinner';
import { getAccountAddress } from '~app/redux/wallet.slice';
import styled from 'styled-components';
import { PrimaryButton, Grid } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum';
import { checkAllowance, requestAllowance } from '~root/services/tokenContract.service';

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

const Step = styled.div<{ isCurrent: boolean; hasFinished?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  text-align: center;
  padding: 3px 10px;
  background-color: ${({ theme, isCurrent }) => (isCurrent ? theme.colors.primarySuccessRegularOpacity : theme.colors.gray10)};
  border: ${({ theme, isCurrent }) => `1px solid ${isCurrent ? theme.colors.primarySuccessDark : theme.colors.gray30}`};
  ${({ hasFinished }) => {
    if (hasFinished) {
      return {
        border: 'none',
        backgroundSize: 'contain',
        backgroundColor: '#20eec8',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(/images/step-done.svg)'
      };
    }
  }}
`;

const StepText = styled.div`
  width: 10px;
  height: 22px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray90};
`;

const Line = styled.div`
  height: 1px;
  width: 272px;
  margin: 15.5px 0;
  background-color: ${({ theme }) => theme.colors.gray40};
`;

type ButtonParams = {
  text: string;
  disable: boolean;
  onClick?: any;
  testId?: string;
  errorButton?: boolean;
  withAllowance?: boolean;
  checkboxText?: string | null;
  checkBoxCallBack?: (() => void) | null;
  isCheckboxChecked?: boolean;
  isLoading?: boolean;
  totalAmount?: string;
  allowanceApprovedCB?: () => void;
};

const AllowanceButton = ({ disable, onClick, text, checkboxText, checkBoxCallBack, isCheckboxChecked, totalAmount, isLoading, allowanceApprovedCB }: ButtonParams) => {
  const [hasCheckedAllowance, setHasCheckedAllowance] = useState(false);
  const [hasToRequestApproval, setHasToRequestApproval] = useState(false);
  const [hasGotAllowanceApproval, setHasGotAllowanceApproval] = useState(false);
  const [approveButtonText, setApproveButtonText] = useState('Approve SSV');
  const [allowanceButtonDisable, setAllowanceButtonDisable] = useState(false);
  const dispatch = useAppDispatch();
  const accountAddress = useAppSelector(getAccountAddress);

  const checkUserAllowance = async (isDoubleCheck?: boolean) => {
    const approvedAllowance = await checkAllowance({ accountAddress });
    if (approvedAllowance < Number(toWei(totalAmount?.replace(',', '')))) {
      setHasToRequestApproval(true);
      setHasGotAllowanceApproval(false);
      setApproveButtonText('Approve SSV');
    } else {
      if (!isDoubleCheck) {
        setHasToRequestApproval(false);
      } else {
        setApproveButtonText('Approved');
        setHasGotAllowanceApproval(true);
        allowanceApprovedCB && allowanceApprovedCB();
      }
    }
    setHasCheckedAllowance(true);
  };

  useEffect(() => {
    checkUserAllowance();
  }, [totalAmount]);

  const handlePendingTransaction = ({ txHash }: { txHash: string }) => {
    dispatch(setTxHash(txHash));
    dispatch(setIsShowTxPendingPopup(true));
    notifyService.hash(txHash);
  };

  const requestAllowanceHandler = async () => {
    try {
      setAllowanceButtonDisable(true);
      setApproveButtonText('Approving…');
      const res = await requestAllowance(handlePendingTransaction);
      if (res) {
        await checkUserAllowance(true);
      } else {
        setApproveButtonText('Approve SSV');
      }
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
        onClick={onClick ? onClick : () => {}}
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
            onClick={!allowanceButtonDisable ? requestAllowanceHandler : () => {}}
            size={ButtonSize.XL}
          />
          <PrimaryButton
            isDisabled={!hasGotAllowanceApproval || disable}
            isLoading={isLoading}
            onClick={onClick ? onClick : () => {}}
            text={!!accountAddress ? text : translations.CTA_BUTTON.CONNECT}
            size={ButtonSize.XL}
          />
        </ButtonWrapper>
        <ProgressStepsWrapper>
          <ProgressStepsInner>
            {/* @ts-ignore */}
            <Step hasFinished={hasGotAllowanceApproval} isCurrent={!hasGotAllowanceApproval}>
              {!hasGotAllowanceApproval && <StepText>1</StepText>}
            </Step>
            <Line />
            {/* @ts-ignore */}
            <Step isCurrent={hasGotAllowanceApproval}>
              <StepText>2</StepText>
            </Step>
          </ProgressStepsInner>
        </ProgressStepsWrapper>
      </Container>
    );
  };

  if (!hasCheckedAllowance) {
    return <Spinner size={35} />;
  }

  return (
    <Grid container>
      {checkboxText && checkBoxCallBack && (
        <Grid item xs={12}>
          <CheckBox toggleIsChecked={checkBoxCallBack} text={checkboxText} isChecked={isCheckboxChecked} />
        </Grid>
      )}
      {hasToRequestApproval ? userNeedApproval() : regularButton()}
    </Grid>
  );
};

export default AllowanceButton;
