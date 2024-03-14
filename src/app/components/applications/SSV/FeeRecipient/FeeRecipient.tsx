import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { toChecksumAddress } from 'web3-utils';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/components/common/LinkText';
import TextInput from '~app/components/common/TextInput';
import InputLabel from '~app/components/common/InputLabel';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import { useStyles } from '~app/components/applications/SSV/FeeRecipient/FeeRecipient.styles';
import TermsAndConditionsCheckbox from '~app/components/common/TermsAndConditionsCheckbox/TermsAndConditionsCheckbox';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { setIsLoading } from '~app/redux/appState.slice';
import { getFeeRecipientAddress, setFeeRecipient as setFeeRecipientAccountService } from '~root/services/account.service';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import { getIsMainnet } from '~app/redux/wallet.slice';


const checkAddressChecksum = (address: string) => {
  try {
    return toChecksumAddress(address) === address;
  } catch (e) {
    return false;
  }
};

const FeeRecipient = () => {
  const stores = useStores();
  const classes = useStyles();
  const walletStore: WalletStore = stores.Wallet;
  const [readOnlyState, setReadOnlyState] = useState(true);
  const [isAddressValid, setIsAddressValid] = useState(true);
  const [userInput, setUserInput] = useState('');
  const isMainnet = useAppSelector(getIsMainnet);
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchFeeRecipientAddress = async () => {
      const res = await getFeeRecipientAddress({ address: walletStore.accountAddress });
      setUserInput(res || walletStore.accountAddress);
    };
    fetchFeeRecipientAddress();
  }, []);

  const submitFeeRecipient = async () => {
    dispatch(setIsLoading(true));
    await setFeeRecipientAccountService({ feeRecipientAddress: userInput, isContractWallet: walletStore.isContractWallet });
    dispatch(setIsLoading(false));
  };

  const setFeeRecipient = (e: any) => {
    const textInput = e.target.value.trim();
    try {
      const checksumInput = toChecksumAddress(textInput);
      const isChecksumAddress = checkAddressChecksum(checksumInput);
      setIsAddressValid(isChecksumAddress);
    } catch {
      setIsAddressValid(false);
    }
    setUserInput(textInput);
  };

  const submitDisable = !isAddressValid || userInput.length !== 42;

  return (
      <BorderScreen
          blackHeader
          header={'Fee Recipient Address'}
          body={[
              (
                  <Grid container item style={{ gap: 32 }}>
                    <Grid container style={{ gap: 24 }}>
                    <Grid item className={classes.Text}>
                      Enter an Ethereum address that will receive all of your validators block proposal rewards. <LinkText text={'What are proposal rewards?'} link={config.links.SSV_DOCUMENTATION} />
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
                            icon={<Grid onClick={()=> setReadOnlyState(false)} className={classes.EditIcon}/>}
                        />
                        <Grid className={classes.ErrorText}>{!isAddressValid ? 'Invalid address, please input a valid Ethereum wallet address' : ''}</Grid>
                      </Grid>
                        <TermsAndConditionsCheckbox isChecked={isChecked} toggleIsChecked={() => setIsChecked(!isChecked)} isMainnet={isMainnet}>
                            <PrimaryButton disable={readOnlyState || submitDisable || (isMainnet && !isChecked)} children={'Update'} submitFunction={submitFeeRecipient}/>
                        </TermsAndConditionsCheckbox>
                    </Grid>
                  </Grid>
              ),
          ]}
      />
  );
};

export default observer(FeeRecipient);
