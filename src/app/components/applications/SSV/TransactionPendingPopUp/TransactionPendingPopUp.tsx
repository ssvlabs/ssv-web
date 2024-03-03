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
import { WalletStore } from '~app/common/stores/applications/SsvWeb';
import { getEtherScanLink } from '~root/providers/networkInfo.provider';
import AddressKeyInput from '~app/components/common/AddressKeyInput/AddressKeyInput';
import { useStyles } from '~app/components/applications/SSV/TransactionPendingPopUp/TransactionPendingPopUp.styles';
import { getIsShowTxPendingPopup, getTxHash, setIsLoading, setIsShowTxPendingPopup } from '~app/redux/appState.slice';

const AdditionText = styled.div`
    width: 100%;
    font-size: 16px;,
    font-weight: 500;
    color: ${({ theme }) => theme.colors.gray80}
`;

enum PopUpTypes {
  DEFAULT = 'default',
  MULTI_SIGN = 'multi',
}

const POP_UP_DATA = {
  [PopUpTypes.DEFAULT]: {
    title: 'Sending Transaction',
    subTitles: 'Your transaction is pending on the blockchain - please wait while it\'s being confirmed',
  },
  [PopUpTypes.MULTI_SIGN]: {
    title: 'Transaction Initiated',
    subTitles: 'Your transaction has been successfully initiated within the multi-sig wallet and is now pending approval from other participants.',
  },
};

const TransactionPendingPopUp = () => {
  const stores = useStores();
  const dispatch = useDispatch();
  const walletStore: WalletStore = stores.Wallet;
  const navigate = useNavigate();
  const isShowTxPendingPopup = useAppSelector(getIsShowTxPendingPopup);
  const txHash = useAppSelector(getTxHash);
  const popUpType = walletStore.isContractWallet ? PopUpTypes.MULTI_SIGN : PopUpTypes.DEFAULT;
  const isMultiSign = popUpType === PopUpTypes.MULTI_SIGN;
  const classes = useStyles({ loaderBottom : isMultiSign ? 0 : 40 });

  const closeButtonAction = () => {
    dispatch(setIsLoading(false));
    dispatch(setIsShowTxPendingPopup(false));
    navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD);
  };

  return (
    <Dialog className={classes.DialogWrapper} aria-labelledby="simple-dialog-title" open={isShowTxPendingPopup}>
      <Grid className={classes.gridWrapper} container>
        <HeaderSubHeader closeButtonAction={closeButtonAction} showCloseButton={isMultiSign} title={POP_UP_DATA[popUpType].title}
                         subtitle={POP_UP_DATA[popUpType].subTitles}/>
        {isMultiSign && <AdditionText>Please return to this web app once approved.</AdditionText>}
        <Grid item>
          <img className={classes.Loader} src={getImage('ssv-loader.svg')} alt="loader"/>
        </Grid>
        {!isMultiSign && <Grid item container style={{ marginBottom: 20 }}>
          <Grid item xs>
            <div className={classes.validatorText}>Transaction Hash</div>
          </Grid>
          <AddressKeyInput whiteBackgroundColor withCopy address={txHash}/>
        </Grid>}
        {!isMultiSign && <LinkText text={'View on Etherscan'} link={`${getEtherScanLink()}/tx/${txHash}`}/>}
      </Grid>
    </Dialog>
  );
};

export default TransactionPendingPopUp;
