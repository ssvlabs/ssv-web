import HCaptcha from '@hcaptcha/react-hcaptcha';
import Grid from '@mui/material/Grid';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '~app/atomicComponents/PrimaryButton';
import config from '~app/common/config';
import translations from '~app/common/config/translations';
import { useStyles } from '~app/components/applications/Faucet/RequestForSsv/RequestForSsv.styles';
import BorderScreen from '~app/components/common/BorderScreen';
import InputLabel from '~app/components/common/InputLabel';
import TextInput from '~app/components/common/TextInput';
import { ButtonSize } from '~app/enums/Button.enum';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getIsDarkMode } from '~app/redux/appState.slice';
import { getAccountAddress, getIsMainnet } from '~app/redux/wallet.slice';
import { currentNetworkName } from '~root/providers/networkInfo.provider';
import { getAmountToTransfer, requestSsvFromFaucet } from '~root/services/faucet.service';

const RequestForSsv = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [buttonText, setButtonText] = useState('Request');
  const [reachedMaxTransactionPerDay, setReachedMaxTransactionPerDay] = useState(false);
  const [amountToTransfer, setAmountToTransfer] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    const response = await requestSsvFromFaucet({ address: accountAddress });
    if (!response.status) {
      if (response.type === translations.FAUCET.FAUCET_DEPLETED) {
        setIsLoading(false);
        navigate(config.routes.FAUCET.DEPLETED);
      } else {
        setError(translations.FAUCET.REACHED_MAX_TRANSACTIONS);
        setReachedMaxTransactionPerDay(true);
        setIsLoading(false);
        setButtonText('Request');
      }
      return;
    }
    setIsLoading(false);
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
            <InputLabel title="Recipient Wallet" />
            <TextInput disable data-testid="recipient-wallet" value={accountAddress} />
          </Grid>
          <Grid item xs={12}>
            <InputLabel title="Request Amount" />
            {amountToTransfer !== undefined && <TextInput disable value={`${amountToTransfer} SSV`} data-testid="request-amount" wrapperClass={classes.AmountInput} />}
          </Grid>
          {error && (
            <Grid item xs={12} className={classes.ErrorText}>
              {error}
            </Grid>
          )}
          <HCaptcha ref={captchaRef} theme={isDarkMode ? 'dark' : 'light'} onVerify={() => setDisabled(false)} sitekey={String(import.meta.env.VITE_CAPTCHA_KEY)} />
          <PrimaryButton text={buttonText} onClick={requestForSSV} isDisabled={isMainnet || disabled || reachedMaxTransactionPerDay} isLoading={isLoading} size={ButtonSize.XL} />
        </Grid>
      ]}
    />
  );
};

export default RequestForSsv;
