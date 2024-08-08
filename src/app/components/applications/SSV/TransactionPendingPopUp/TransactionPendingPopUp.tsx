import Grid from '@mui/material/Grid';
import styled from 'styled-components';
import Dialog from '@mui/material/Dialog';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import LinkText from '~app/components/common/LinkText';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import { getEtherScanLink } from '~root/providers/networkInfo.provider';
import AddressKeyInput from '~app/components/common/AddressKeyInput/AddressKeyInput';
import {
  getIsPopUpWithIndexingStatus,
  getIsShowTxPendingPopup,
  getTransactionStatus,
  getTxHash,
  setIsLoading,
  setIsShowTxPendingPopup,
  setTransactionStatus
} from '~app/redux/appState.slice';
import { getIsContractWallet } from '~app/redux/wallet.slice';
import { getSelectedOperator } from '~app/redux/account.slice.ts';
import { TransactionStatus } from '~app/enums/transactionStatus.enum.ts';

const DialogWrapper = styled(Dialog)<{ theme: any }>`
  & > div > div {
    border-radius: 16px;
    background-color: ${({ theme }) => theme.colors.white};
  }
`;

const GridWrapper = styled(Grid)<{ theme: any }>`
  width: 424px;
  padding: 32px;
  border-radius: 16px;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.white};
`;

const ImageWrapper = styled.img<{ hasMarginBottom: boolean }>`
  width: 100px;
  margin-top: 20px;
  margin-bottom: ${({ hasMarginBottom }) => (hasMarginBottom ? 40 : 0)}px;
`;

const AdditionText = styled.div`
  width: 100%;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray80};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ValidatorText = styled.div<{ theme: any }>`
  font-size: 14px;
  font-weight: 600;
  line-height: 1.14;
  text-align: left;
  color: ${({ theme }) => theme.colors.gray40};
  margin-bottom: 8px;
`;

const IndicatorWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Line = styled.div`
  width: 136px;
  height: 0;
  margin-top: 8px;
  border: ${({ theme }) => `1px solid ${theme.colors.gray20}`};
`;

const IndicatorBox = styled.div<{ isProcessing: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: ${({ isProcessing, theme }) => (isProcessing ? theme.colors.black : theme.colors.gray40)};
`;

const Indicator = styled.div<{ isDisabled?: boolean; isSucceed?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 100px;
  border: ${({ theme, isDisabled }) => `2px solid ${isDisabled ? theme.colors.gray20 : theme.colors.primarySuccessDark}`};
  background-color: ${({ theme, isDisabled, isSucceed }) => {
    if (isSucceed) return theme.colors.primarySuccessDark;
    return isDisabled ? theme.colors.gray10 : theme.colors.primarySuccessRegularOpacity;
  }};
  background-position: center;
  background-repeat: no-repeat;
  background-image: ${({ isSucceed }) => (isSucceed ? 'url(/images/v/light.svg)' : 'none')};
`;

const POP_UP_DATA = {
  defaultWallet: {
    [TransactionStatus.PENDING]: {
      title: 'Transaction Details',
      subTitles: (
        <div>
          Your transaction is <span style={{ fontWeight: 800 }}>pending</span> on the blockchain - please wait while it’s being confirmed
        </div>
      )
    },
    [TransactionStatus.INDEXING]: {
      title: 'Transaction Details',
      subTitles: (
        <div>
          Your transaction is being <span style={{ fontWeight: 800 }}>indexed</span> on the SSV Network - please wait while it’s processed
        </div>
      )
    }
  },
  contractWallet: {
    title: 'Transaction Initiated',
    subTitles: 'Your transaction has been successfully initiated within the multi-sig wallet and is now pending approval from other participants.'
  }
};

const TransactionPendingPopUp = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isContractWallet = useAppSelector(getIsContractWallet);
  const isShowTxPendingPopup = useAppSelector(getIsShowTxPendingPopup);
  const isPopUpWithIndexing = useAppSelector(getIsPopUpWithIndexingStatus);
  const txHash = useAppSelector(getTxHash);
  const operator = useAppSelector(getSelectedOperator);
  const txStatus = useAppSelector(getTransactionStatus);
  const isPending = txStatus === TransactionStatus.PENDING;

  const popUpData = isContractWallet ? POP_UP_DATA.contractWallet : POP_UP_DATA.defaultWallet[txStatus];

  const closeButtonAction = () => {
    let nextNavigation;
    if (operator) {
      nextNavigation = config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD;
    } else {
      nextNavigation = config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD;
    }
    dispatch(setIsLoading(false));
    dispatch(setIsShowTxPendingPopup(false));
    dispatch(setTransactionStatus(TransactionStatus.PENDING));
    navigate(nextNavigation);
  };

  return (
    <DialogWrapper aria-labelledby="simple-dialog-title" open={isShowTxPendingPopup}>
      <GridWrapper container>
        <HeaderSubHeader closeButtonAction={closeButtonAction} showCloseButton={isContractWallet} title={popUpData.title} subtitle={popUpData.subTitles} />
        {isContractWallet && <AdditionText>Please return to this web app once approved.</AdditionText>}
        <Wrapper>
          <ImageWrapper src={isPopUpWithIndexing && !isPending ? '/images/loaderIndexing.svg' : '/images/ssv-loader.svg'} alt="loader" hasMarginBottom={!isContractWallet} />
          {!isContractWallet && isPopUpWithIndexing && (
            <IndicatorWrapper>
              <IndicatorBox isProcessing={isPending}>
                <Indicator isSucceed={!isPending} />
                {isPending ? 'Pending...' : 'Pending'}
              </IndicatorBox>
              <Line />
              <IndicatorBox isProcessing={!isPending}>
                <Indicator isDisabled={isPending} />
                {isPending ? 'Indexing' : 'Indexing...'}
              </IndicatorBox>
            </IndicatorWrapper>
          )}
        </Wrapper>
        {!isContractWallet && (
          <Grid item container style={{ marginBottom: 20, marginTop: 20 }}>
            <Grid item xs>
              <ValidatorText>Transaction Hash</ValidatorText>
            </Grid>
            <AddressKeyInput whiteBackgroundColor withCopy address={txHash} />
          </Grid>
        )}
        {!isContractWallet && <LinkText text={'View on Etherscan'} link={`${getEtherScanLink()}/tx/${txHash}`} />}
      </GridWrapper>
    </DialogWrapper>
  );
};

export default TransactionPendingPopUp;
