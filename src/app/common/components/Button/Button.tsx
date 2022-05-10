import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { useStores } from '~app/hooks/useStores';
import { translations } from '~app/common/config';
import CheckBox from '~app/common/components/CheckBox';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import PrimaryButton from '~app/common/components/Button/PrimaryButton';
import { useStyles } from '~app/common/components/Button/Button.styles';
import SecondaryButton from '~app/common/components/Button/SecondaryButton';

type ButtonParams = {
    text: string,
    disable: boolean,
    onClick?: any,
    testId?: string,
    errorButton?: boolean,
    checkboxesText?: any[],
    withAllowance?: boolean,
    checkBoxesCallBack?: any[],
};

const Button = (props: ButtonParams) => {
    const stores = useStores();
    const classes = useStyles();
    const ssvStore: SsvStore = stores.SSV;
    const walletStore: WalletStore = stores.Wallet;
    const [userAllowance, setUserAllowance] = useState(false);
    const [isApprovalProcess, setApprovalProcess] = useState(false);
    const [approveButtonText, setApproveButtonText] = useState('Approve SSV');
    const { testId, withAllowance, disable, onClick, text, errorButton, checkboxesText, checkBoxesCallBack } = props;

    useEffect(() => {
        if (!ssvStore.userGaveAllowance && withAllowance && !isApprovalProcess) {
            setApprovalProcess(true);
        }
    }, [ssvStore.userGaveAllowance, withAllowance, isApprovalProcess]);

    const checkWalletConnected = async (onClickCallBack: any) => {
        if (!walletStore.connected) await walletStore.connect();
        if (walletStore.isWrongNetwork) {
            // await walletStore.networkHandler(10);
        } else if (onClickCallBack) onClickCallBack();
    };

    const handlePendingTransaction = () => {
        setApproveButtonText('Approving…');
    };

    const allowNetworkContract = async () => {
        setApproveButtonText('Waiting...');
        const userGavePermission = await ssvStore.approveAllowance(false, handlePendingTransaction);
        if (userGavePermission) {
            setApproveButtonText('Approved');
            setUserAllowance(true);
        } else {
            setApproveButtonText(approveButtonText);
        }
    };

    const regularButton = () => {
        return (
          <PrimaryButton
            disable={disable}
            dataTestId={testId}
            errorButton={errorButton}
            submitFunction={() => { checkWalletConnected(onClick); }}
            text={walletStore.connected ? text : translations.CTA_BUTTON.CONNECT}
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
                submitFunction={() => { checkWalletConnected(allowNetworkContract); }}
              />
            </Grid>
            <Grid item xs>
              <SecondaryButton
                disable={!userAllowance || disable}
                dataTestId={testId} submitFunction={() => { checkWalletConnected(onClick); }}
                text={walletStore.connected ? text : translations.CTA_BUTTON.CONNECT}
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
        {isApprovalProcess && process.env.REACT_APP_NEW_STAGE ? userNeedApproval() : regularButton()}
      </Grid>
    );
};

export default observer(Button);