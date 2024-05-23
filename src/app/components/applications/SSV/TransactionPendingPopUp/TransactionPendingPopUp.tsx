import Grid from '@mui/material/Grid';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import LinkText from '~app/components/common/LinkText';
import { useAppSelector } from '~app/hooks/redux.hook';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import { getEtherScanLink } from '~root/providers/networkInfo.provider';
import AddressKeyInput from '~app/components/common/AddressKeyInput/AddressKeyInput';
import { getIsShowTxPendingPopup, getTxHash, setIsLoading, setIsShowTxPendingPopup } from '~app/redux/appState.slice';
import { ProcessType, SingleCluster as SingleClusterProcess } from '~app/model/processes.model';
import { getIsContractWallet } from '~app/redux/wallet.slice';
import { getProcess, getType } from '~app/redux/process.slice.ts';

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

const ValidatorText = styled.div<{ theme: any }>`
  font-size: 14px;
  font-weight: 600;
  line-height: 1.14;
  text-align: left;
  color: ${({ theme }) => theme.colors.gray40};
  margin-bottom: 8px;
`;

const POP_UP_DATA = {
  false: {
    title: 'Sending Transaction',
    subTitles: "Your transaction is pending on the blockchain - please wait while it's being confirmed"
  },
  true: {
    title: 'Transaction Initiated',
    subTitles: 'Your transaction has been successfully initiated within the multi-sig wallet and is now pending approval from other participants.'
  }
};

const ROUTES_BY_PROCESS = {
  [ProcessType.Operator]: config.routes.SSV.MY_ACCOUNT.OPERATOR.ROOT,
  [ProcessType.Validator]: config.routes.SSV.MY_ACCOUNT.CLUSTER.ROOT
};

const TransactionPendingPopUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isContractWallet = useAppSelector(getIsContractWallet);
  const isShowTxPendingPopup = useAppSelector(getIsShowTxPendingPopup);
  const txHash = useAppSelector(getTxHash);
  const process: SingleClusterProcess | undefined = useAppSelector(getProcess);
  const type = useAppSelector(getType);
  const cluster = process?.item;

  const closeButtonAction = () => {
    let nextNavigation;
    if (!type || (type === ProcessType.Validator && !cluster)) {
      nextNavigation = config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD;
    } else {
      nextNavigation = ROUTES_BY_PROCESS[type];
    }
    dispatch(setIsLoading(false));
    dispatch(setIsShowTxPendingPopup(false));
    navigate(nextNavigation);
  };

  return (
    <DialogWrapper aria-labelledby="simple-dialog-title" open={isShowTxPendingPopup}>
      <GridWrapper container>
        <HeaderSubHeader
          closeButtonAction={closeButtonAction}
          showCloseButton={isContractWallet}
          title={POP_UP_DATA[`${isContractWallet}`].title}
          subtitle={POP_UP_DATA[`${isContractWallet}`].subTitles}
        />
        {isContractWallet && <AdditionText>Please return to this web app once approved.</AdditionText>}
        <Grid item>
          <ImageWrapper src={'/images/ssv-loader.svg'} alt="loader" hasMarginBottom={!isContractWallet} />
        </Grid>
        {!isContractWallet && (
          <Grid item container style={{ marginBottom: 20 }}>
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
