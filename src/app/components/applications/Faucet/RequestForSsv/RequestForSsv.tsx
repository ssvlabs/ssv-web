import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import React, { useState, useRef, useEffect } from 'react';
import config from '~app/common/config';
import TextInput from '~app/components/common/TextInput';
import translations from '~app/common/config/translations';
import InputLabel from '~app/components/common/InputLabel';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import { useStyles } from '~app/components/applications/Faucet/RequestForSsv/RequestForSsv.styles';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { getIsDarkMode, setIsLoading } from '~app/redux/appState.slice';
import { currentNetworkName } from '~root/providers/networkInfo.provider';
import { getAmountToTransfer, requestSsvFromFaucet } from '~root/services/faucet.service';
import { getAccountAddress, getIsMainnet } from '~app/redux/wallet.slice';

const RequestForSsv = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [buttonText, setButtonText] = useState('Request');
  const [reachedMaxTransactionPerDay, setReachedMaxTransactionPerDay] = useState(false);
  const [amountToTransfer, setAmountToTransfer] = useState(undefined);
  const dispatch = useAppDispatch();
  const accountAddress = useAppSelector(getAccountAddress);
  const isDarkMode = useAppSelector(getIsDarkMode);
  const isMainnet = useAppSelector(getIsMainnet);
  const classes = useStyles();
  const captchaRef = useRef(null);

  useEffect(() => {
    setError('');
    setDisabled(true);
    setButtonText('Request');
    const fetchAmountToTransfer = async () => {
      const res = await getAmountToTransfer();
      setAmountToTransfer(res);
    };
    fetchAmountToTransfer();
  }, [accountAddress]);

  const requestForSSV = async () => {
    setError('');
    setButtonText('Requesting...');
    dispatch(setIsLoading(true));
    const response = await requestSsvFromFaucet({ address: accountAddress });
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
              value={accountAddress}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel title="Request Amount"/>
            {amountToTransfer !== undefined && <TextInput
              disable
              value={`${amountToTransfer} SSV`}
              data-testid='request-amount'
              wrapperClass={classes.AmountInput}
            />}
          </Grid>
          {error && <Grid item xs={12} className={classes.ErrorText}>{error}</Grid>}
          <HCaptcha
            ref={captchaRef}
            theme={isDarkMode ? 'dark' : 'light'}
            onVerify={() => setDisabled(false)}
            sitekey={String(process.env.REACT_APP_CAPTCHA_KEY)}
          />
          <PrimaryButton wrapperClass={classes.SubmitButton} children={buttonText} submitFunction={requestForSSV}
                         disable={isMainnet || disabled || reachedMaxTransactionPerDay} />
        </Grid>,
      ]}
    />
  );
};

export default RequestForSsv;
