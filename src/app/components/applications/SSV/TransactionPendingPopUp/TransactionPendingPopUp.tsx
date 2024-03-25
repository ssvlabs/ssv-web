import React from 'react';
import Grid from '@mui/material/Grid';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { getImage } from '~lib/utils/filePath';
import LinkText from '~app/components/common/LinkText';
import { useAppSelector } from '~app/hooks/redux.hook';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import { ProcessStore, WalletStore } from '~app/common/stores/applications/SsvWeb';
import { getEtherScanLink } from '~root/providers/networkInfo.provider';
import AddressKeyInput from '~app/components/common/AddressKeyInput/AddressKeyInput';
import { getIsShowTxPendingPopup, getTxHash, setIsLoading, setIsShowTxPendingPopup } from '~app/redux/appState.slice';
import { ProcessType } from '~app/model/processes.model';

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
    margin-bottom: ${({ hasMarginBottom }) => hasMarginBottom ? 40 : 0}px;
`;

const AdditionText = styled.div`
    width: 100%;
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.gray80}
`;

const ValidatorText = styled.div<{ theme: any }>`
    font-size: 14px;
    font-weight: 600;
    line-height: 1.14;
    text-align: left;
    color: ${({ theme }) => theme.colors.gray40};
    margin-bottom: 8px;
`;

const POP_UP_DATA = {
  'false': {
    title: 'Sending Transaction',
    subTitles: 'Your transaction is pending on the blockchain - please wait while it\'s being confirmed',
  },
  'true': {
    title: 'Transaction Initiated',
    subTitles: 'Your transaction has been successfully initiated within the multi-sig wallet and is now pending approval from other participants.',
  },
};

const ROUTES_BY_PROCESS = {
  [ProcessType.Operator]: config.routes.SSV.MY_ACCOUNT.OPERATOR.ROOT,
  [ProcessType.Validator]: config.routes.SSV.MY_ACCOUNT.CLUSTER.ROOT,
};

const TransactionPendingPopUp = () => {
  const stores = useStores();
  const dispatch = useDispatch();
  const walletStore: WalletStore = stores.Wallet;
  const processStore: ProcessStore = stores.Process;
  const navigate = useNavigate();
  const isShowTxPendingPopup = useAppSelector(getIsShowTxPendingPopup);
  const txHash = useAppSelector(getTxHash);

  const closeButtonAction = () => {
    const nextNavigation = processStore.type  ? ROUTES_BY_PROCESS[processStore.type] : config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD;
    dispatch(setIsLoading(false));
    dispatch(setIsShowTxPendingPopup(false));
    navigate(nextNavigation);
  };

  return (
    <DialogWrapper aria-labelledby="simple-dialog-title" open={isShowTxPendingPopup}>
      <GridWrapper container>
        <HeaderSubHeader closeButtonAction={closeButtonAction} showCloseButton={walletStore.isContractWallet} title={POP_UP_DATA[`${walletStore.isContractWallet}`].title}
                         subtitle={POP_UP_DATA[`${walletStore.isContractWallet}`].subTitles}/>
        {walletStore.isContractWallet && <AdditionText>Please return to this web app once approved.</AdditionText>}
        <Grid item>
          <ImageWrapper src={getImage('ssv-loader.svg')} alt="loader" hasMarginBottom={!walletStore.isContractWallet} />
        </Grid>
        {!walletStore.isContractWallet && <Grid item container style={{ marginBottom: 20 }}>
          <Grid item xs>
            <ValidatorText>Transaction Hash</ValidatorText>
          </Grid>
          <AddressKeyInput whiteBackgroundColor withCopy address={txHash}/>
        </Grid>}
        {!walletStore.isContractWallet && <LinkText text={'View on Etherscan'} link={`${getEtherScanLink()}/tx/${txHash}`}/>}
      </GridWrapper>
    </DialogWrapper>
  );
};

export default TransactionPendingPopUp;
