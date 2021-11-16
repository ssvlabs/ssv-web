import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useStores } from '~app/hooks/useStores';
import { translations } from '~app/common/config';
import CheckBox from '~app/common/components/CheckBox';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import ContractSsv from '~app/common/stores/contract/ContractSsv.store';
import { useStyles } from '~app/common/components/CTAButton/CTAButton.styles';

type ButtonParams = {
    text: string,
    disable: boolean,
    onClick?: any,
    testId?: string,
    withAllowance?: boolean,
    backgroundColor?: string,
    checkboxesText?: any[],
    checkBoxesCallBack?: any[],
};

const CTAButton = ({
                       testId,
                       withAllowance,
                       disable,
                       onClick,
                       text,
                       backgroundColor,
                       checkboxesText,
                       checkBoxesCallBack,
                   }: ButtonParams) => {
    const stores = useStores();
    const classes = useStyles();
    const walletStore: WalletStore = stores.Wallet;
    const contractSsv: ContractSsv = stores.ContractSsv;
    const [userAllowance, setUserAllowance] = useState(false);
    const [approveButtonText, setApproveButtonText] = useState('Approve SSV');

    const checkWalletConnected = async (onClickCallBack: any) => {
        if (!walletStore.connected) await walletStore.connect();
        if (walletStore.isWrongNetwork) {
            walletStore.alertNetworkError();
        } else if (onClickCallBack) onClickCallBack();
    };

    const handlePendingTransaction = () => {
        setApproveButtonText('Approving…');
    };

    const allowNetworkContract = () => {
        setApproveButtonText('Waiting...');
        contractSsv.approveAllowance(false, handlePendingTransaction).then((response: any) => {
            contractSsv.setApprovedAllowance(response?.ssvValue);
            setApproveButtonText('Approved');
            setUserAllowance(true);
        });
    };

    const regulerButton = () => {
        return (
          <Button
            data-testid={testId}
            style={{ backgroundColor }}
            disabled={disable}
            variant="contained"
            color={'primary'}
            className={classes.button}
            onClick={() => { checkWalletConnected(onClick); }}
          >
            {walletStore.connected ? text : translations.CTA_BUTTON.CONNECT}
          </Button>
        );
    };

    const userNeedApproval = () => {
        return (
          <Grid item container justify={'space-between'}>
            <Grid item xs={5}>
              <Button
                data-testid={testId}
                style={{ backgroundColor }}
                disabled={userAllowance}
                variant="contained"
                color={'primary'}
                className={classes.button}
                onClick={() => { checkWalletConnected(allowNetworkContract); }}
              >
                {approveButtonText}
              </Button>
            </Grid>
            <Grid item xs={5}>
              <Button
                data-testid={testId}
                style={{ backgroundColor }}
                disabled={!userAllowance || disable}
                variant="contained"
                color={'primary'}
                className={classes.button}
                onClick={() => { checkWalletConnected(onClick); }}
              >
                {walletStore.connected ? text : translations.CTA_BUTTON.CONNECT}
              </Button>
            </Grid>
            <Grid container item className={classes.ProgressStepsWrapper}>
              <Grid item className={`${classes.Step} ${classes.Checked} ${userAllowance ? classes.Finish : ''}`}>
                1
              </Grid>
              <Grid item xs className={`${classes.Line} ${userAllowance ? classes.Finish : ''}`} />
              <Grid item className={`${classes.Step} ${userAllowance ? classes.Checked : ''}`}>
                2
              </Grid>
            </Grid>
          </Grid>
        );
    };

    return (
      <Grid container>
        {checkboxesText?.map((checkboxText: string, index: number) => {
            return (
                // @ts-ignore
              <Grid key={index} item xs={12}><CheckBox onClickCallBack={checkBoxesCallBack[index]}
                text={checkboxText} /></Grid>
            );
        })}
        {(contractSsv.approvedAllowance || !withAllowance) ? regulerButton() : userNeedApproval()}
      </Grid>
    );
};

export default observer(CTAButton);