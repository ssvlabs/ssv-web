import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useStores } from '~app/hooks/useStores';
import { translations } from '~app/common/config';
import CheckBox from '~app/components/common/CheckBox';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import { useStyles } from '~app/components/common/Button/Button.styles';
import { toWei } from '~root/services/conversions.service';
import { setIsShowTxPendingPopup, setTxHash } from '~app/redux/appState.slice';
import { useAppDispatch } from '~app/hooks/redux.hook';
import notifyService from '~root/services/notify.service';

type ButtonParams = {
    text: string,
    disable: boolean,
    onClick?: any,
    testId?: string,
    errorButton?: boolean,
    checkboxesText?: any[],
    withAllowance?: boolean,
    checkBoxesCallBack?: any[],
    isLoading?: boolean,
    totalAmount?: string,
};

const Button = (props: ButtonParams) => {
    const stores = useStores();
    const classes = useStyles();
    const ssvStore: SsvStore = stores.SSV;
    const walletStore: WalletStore = stores.Wallet;
    const [userAllowance, setUserAllowance] = useState(false);
    const [isApprovalProcess, setApprovalProcess] = useState(false);
    const [approveButtonText, setApproveButtonText] = useState('Approve SSV');
    const [allowanceButtonDisable, setAllowanceButtonDisable] = useState(false);
    const { testId, withAllowance, disable, onClick, text, errorButton, checkboxesText, checkBoxesCallBack, totalAmount, isLoading } = props;
    const dispatch = useAppDispatch();

    useEffect(() => {
    if (Number(totalAmount) > 0) {
        if (!ssvStore.userGaveAllowance && withAllowance && !isApprovalProcess) {
            setApprovalProcess(true);
            return;
        }
        if (totalAmount && Number(toWei(totalAmount)) > Number(ssvStore.approvedAllowance)) {
            setApprovalProcess(true);
            return;
        }
        setApprovalProcess(false);
      }
    }, [ssvStore.userGaveAllowance, withAllowance, isApprovalProcess, totalAmount]);

    // TODO: reduce to single component for wallet connection
    const checkWalletConnected = async (onClickCallBack: any) => {
        // if (!walletStore.wallet) walletStore.connect();
        if (walletStore.isWrongNetwork) {
            // await walletStore.networkHandler(10);
        } else if (onClickCallBack) onClickCallBack();
    };

    const handlePendingTransaction = ({ txHash }: { txHash: string }) => {
        setApproveButtonText('Approving…');
        dispatch(setTxHash(txHash));
        dispatch(setIsShowTxPendingPopup(true));
        notifyService.hash(txHash);
    };

    const allowNetworkContract = async () => {
        try {
            setAllowanceButtonDisable(true);
            setApproveButtonText('Waiting...');
            const userGavePermission = await ssvStore.approveAllowance(handlePendingTransaction);
            await ssvStore.checkAllowance();
            if (Number(toWei(totalAmount)) > Number(ssvStore.approvedAllowance)) {
                setApproveButtonText('Approve SSV');
                return;
            }
            if (userGavePermission) {
                setApproveButtonText('Approved');
                setUserAllowance(true);
            } else {
                setApproveButtonText(approveButtonText);
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
            disable={disable}
            dataTestId={testId}
            errorButton={errorButton}
            isLoading={isLoading}
            submitFunction={() => { checkWalletConnected(onClick); }}
            text={!!walletStore.wallet ? text : translations.CTA_BUTTON.CONNECT}
          />
        );
    };

    const userNeedApproval = () => {
        return (
          <Grid item container>
            <Grid item xs className={classes.ButtonWrapper}>
              <PrimaryButton
                dataTestId={testId}
                text={approveButtonText}
                withoutLoader={userAllowance}
                disable={userAllowance || disable}
                submitFunction={() => { !allowanceButtonDisable && checkWalletConnected(allowNetworkContract); }}
              />
            </Grid>
            <Grid item xs>
              <PrimaryButton
                dataTestId={testId}
                disable={!userAllowance || disable}
                submitFunction={() => { checkWalletConnected(onClick); }}
                text={!!walletStore.wallet ? text : translations.CTA_BUTTON.CONNECT}
              />
            </Grid>
            <Grid container item xs={12}>
              <Grid item container className={classes.ProgressStepsWrapper}>
                <Grid item className={`${classes.Step} ${classes.Current} ${userAllowance ? classes.Finish : ''}`}>
                  {!userAllowance && <Typography className={classes.StepText}>1</Typography>}
                </Grid>
                <Grid item xs className={`${classes.Line} ${userAllowance ? classes.Finish : ''}`} />
                <Grid item className={`${classes.Step} ${userAllowance ? classes.Current : ''}`}>
                  <Typography className={classes.StepText}>2</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
    };

    return (
      <Grid container>
        {checkboxesText?.map((checkboxText: string, index: number) => {
                return (
                  <Grid key={index} item xs={12}>
                    <CheckBox onClickCallBack={checkBoxesCallBack && checkBoxesCallBack[index]} text={checkboxText} />
                  </Grid>
                );
            })}
        {isApprovalProcess ? userNeedApproval() : regularButton()}
      </Grid>
    );
};

export default observer(Button);
