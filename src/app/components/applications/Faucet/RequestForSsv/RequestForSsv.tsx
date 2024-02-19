import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import React, { useState, useRef, useEffect } from 'react';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import TextInput from '~app/components/common/TextInput';
import { currentNetworkName } from '~lib/utils/envHelper';
import translations from '~app/common/config/translations';
import InputLabel from '~app/components/common/InputLabel';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import FaucetStore from '~app/common/stores/applications/Faucet/Faucet.store';
import WalletStore from '~app/common/stores/applications/Faucet/Wallet.store';
import { useStyles } from '~app/components/applications/Faucet/RequestForSsv/RequestForSsv.styles';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { getIsDarkMode, setIsLoading } from '~app/redux/appState.slice';

const RequestForSsv = () => {
  const stores = useStores();
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const navigate = useNavigate();
  const captchaRef = useRef(null);
  const faucetStore: FaucetStore = stores.Faucet;
  const walletStore: WalletStore = stores.Wallet;
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [buttonText, setButtonText] = useState('Request');
  const [reachedMaxTransactionPerDay, setReachedMaxTransactionPerDay] = useState(false);
  const isDarkMode = useAppSelector(getIsDarkMode);

  useEffect(() => {
    setError('');
    setDisabled(true);
    setButtonText('Request');
  }, [walletStore.accountAddress]);

  const requestForSSV = async () => {
    setError('');
    setButtonText('Requesting...');
    dispatch(setIsLoading(true));
    const response = await faucetStore.registerNewTransaction();
    if (!response.status) {
      if (response.type === translations.FAUCET.FAUCET_DEPLETED) {
        dispatch(setIsLoading(false));
        navigate(config.routes.FAUCET.DEPLETED);
      } else {
        setError(translations.FAUCET.REACHED_MAX_TRANSACTIONS);
        setReachedMaxTransactionPerDay(true);
        dispatch(setIsLoading(false));
        setButtonText('Request');
      }
      return;
    }
    dispatch(setIsLoading(false));
    navigate(config.routes.FAUCET.SUCCESS);
    setButtonText('Request');
  };

  return (
    <BorderScreen
      blackHeader
      withoutNavigation
      header={`SSV Faucet ${currentNetworkName()} Testnet`}
      body={[
        <Grid container className={classes.Wrapper}>
          <Grid item xs={12}>
            <InputLabel title="Recipient Wallet"/>
            <TextInput
              disable
              data-testid="recipient-wallet"
              value={walletStore.accountAddress}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel title="Request Amount"/>
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
            theme={isDarkMode ? 'dark' : 'light'}
            onVerify={() => setDisabled(false)}
            sitekey={String(process.env.REACT_APP_CAPTCHA_KEY)}
          />
          <PrimaryButton wrapperClass={classes.SubmitButton} children={buttonText} submitFunction={requestForSSV}
                         disable={walletStore.isWrongNetwork || disabled || reachedMaxTransactionPerDay}
                         withVerifyConnection={false}/>
        </Grid>,
      ]}
    />
  );
};

export default observer(RequestForSsv);
