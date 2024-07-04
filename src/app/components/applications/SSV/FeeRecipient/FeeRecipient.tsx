import { ChangeEvent, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import config from '~app/common/config';
import LinkText from '~app/components/common/LinkText';
import TextInput from '~app/components/common/TextInput';
import InputLabel from '~app/components/common/InputLabel';
import BorderScreen from '~app/components/common/BorderScreen';
import { useStyles } from '~app/components/applications/SSV/FeeRecipient/FeeRecipient.styles';
import TermsAndConditionsCheckbox from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditionsCheckbox';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getFeeRecipientAddress, setFeeRecipient as setFeeRecipientAccountService } from '~root/services/account.service';
import { getAccountAddress, getIsContractWallet, getIsMainnet } from '~app/redux/wallet.slice';
import { checkAddressChecksum } from '~lib/utils/strings';
import { PrimaryButton } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum';

const FeeRecipient = () => {
  const classes = useStyles();
  const accountAddress = useAppSelector(getAccountAddress);
  const isContractWallet = useAppSelector(getIsContractWallet);
  const [readOnlyState, setReadOnlyState] = useState(true);
  const [isAddressValid, setIsAddressValid] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [currentSavedAddress, setCurrentSavedAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isMainnet = useAppSelector(getIsMainnet);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const fetchFeeRecipientAddress = async () => {
      const res = await getFeeRecipientAddress({ address: accountAddress });
      setUserInput(res || accountAddress);
      setCurrentSavedAddress(res || accountAddress);
    };
    fetchFeeRecipientAddress();
  }, []);

  const submitFeeRecipient = async () => {
    setIsLoading(true);
    await setFeeRecipientAccountService({
      feeRecipientAddress: userInput,
      isContractWallet
    });
    setIsLoading(false);
    setReadOnlyState(true);
    setCurrentSavedAddress(userInput);
  };

  const setFeeRecipient = (e: ChangeEvent<HTMLInputElement>) => {
    const textInput = e.target.value.trim();
    try {
      const isChecksumAddress = checkAddressChecksum(textInput);
      setIsAddressValid(isChecksumAddress);
    } catch {
      setIsAddressValid(false);
    }
    setUserInput(textInput);
  };

  const submitDisable = !isAddressValid || userInput.length !== 42 || currentSavedAddress === userInput;

  return (
    <BorderScreen
      blackHeader
      header={'Fee Recipient Address'}
      body={[
        <Grid container item style={{ gap: 32 }}>
          <Grid container style={{ gap: 24 }}>
            <Grid item className={classes.Text}>
              Enter an Ethereum address that will receive all of your validators block proposal rewards.{' '}
              <LinkText text={'What are proposal rewards?'} link={config.links.SSV_DOCUMENTATION} />
            </Grid>
            <Grid className={`${classes.Warning} ${classes.Text}`}>
              Standard rewards from performing other duties will remain to be credited to your validators balance on the Beacon Chain.
            </Grid>
          </Grid>
          <Grid container gap={{ gap: 17 }}>
            <Grid item container>
              <InputLabel title="Fee Recipient Address" />
              <TextInput
                value={userInput}
                disable={readOnlyState}
                showError={!isAddressValid}
                data-testid="new-fee-recipient"
                onChangeCallback={setFeeRecipient}
                icon={<Grid onClick={() => setReadOnlyState(false)} className={classes.EditIcon} />}
              />
              <Grid className={classes.ErrorText}>{!isAddressValid ? 'Invalid address, please input a valid Ethereum wallet address' : ''}</Grid>
            </Grid>
            <TermsAndConditionsCheckbox isChecked={isChecked} toggleIsChecked={() => setIsChecked(!isChecked)} isMainnet={isMainnet}>
              <PrimaryButton
                isDisabled={readOnlyState || submitDisable || (isMainnet && !isChecked)}
                text={'Update'}
                onClick={submitFeeRecipient}
                size={ButtonSize.XL}
                isLoading={isLoading}
              />
            </TermsAndConditionsCheckbox>
          </Grid>
        </Grid>
      ]}
    />
  );
};

export default FeeRecipient;
