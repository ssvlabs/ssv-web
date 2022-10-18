import { observer } from 'mobx-react';
import React, { useState, useRef, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import TextInput from '~app/components/common/TextInput';
import InputLabel from '~app/components/common/InputLabel';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import FaucetStore from '~app/common/stores/applications/Faucet/Faucet.store';
import WalletStore from '~app/common/stores/applications/Faucet/Wallet.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from '~app/components/applications/Faucet/RequestForSsv/RequestForSsv.styles';

const RequestForSsv = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const captchaRef = useRef(null);
    const faucetStore: FaucetStore = stores.Faucet;
    const walletStore: WalletStore = stores.Wallet;
    const [error, setError] = useState('');
    const [disabled, setDisabled] = useState(true);
    const applicationStore: ApplicationStore = stores.Application;
    const [buttonText, setButtonText] = useState('Request');
    const [reachedMaxTransactionPerDay, setReachedMaxTransactionPerDay] = useState(false);

    useEffect(() => {
        setError('');
        setDisabled(true);
        setButtonText('Request');
    }, [walletStore.accountAddress]);

    const requestForSSV = async () => {
        setError('');
        setButtonText('Requesting...');
        applicationStore.setIsLoading(true);
        const response = await faucetStore.registerNewTransaction();
        if (!response.status) {
            if (response.type === 2) {
                applicationStore.setIsLoading(false);
                history.push(config.routes.FAUCET.DEPLETED);
            } else {
                setError('Reached Max Transactions Per Day');
                setReachedMaxTransactionPerDay(true);
                applicationStore.setIsLoading(false);
                setButtonText('Request');
            }
            return;
        }
        applicationStore.setIsLoading(false);
        history.push(config.routes.FAUCET.SUCCESS);
        setButtonText('Request');
    };

    return (
      <BorderScreen
        blackHeader
        withoutNavigation
        header={'SSV Faucet Goerli Testnet'}
        body={[
          <Grid container className={classes.Wrapper}>
            <Grid item xs={12}>
              <InputLabel title="Recipient Wallet" />
              <TextInput
                disable
                data-testid="recipient-wallet"
                value={walletStore.accountAddress}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel title="Request Amount" />
              <TextInput
                disable
                value={`${faucetStore.amountToTransfer ?? 10} SSV`}
                data-testid="request-amount"
                wrapperClass={classes.AmountInput}
              />
            </Grid>
            {error && <Grid item xs={12} className={classes.ErrorText}>{error}</Grid>}
            <HCaptcha
              ref={captchaRef}
              onVerify={() => setDisabled(false)}
              sitekey={String(process.env.REACT_APP_CAPTCHA_KEY)}
            />
            <PrimaryButton wrapperClass={classes.SubmitButton} text={buttonText} submitFunction={requestForSSV} disable={disabled || reachedMaxTransactionPerDay}
              withVerifyConnection={false} />
          </Grid>,
        ]}
      />
    );
};

export default observer(RequestForSsv);
