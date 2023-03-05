import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/components/common/LinkText';
import TextInput from '~app/components/common/TextInput';
import InputLabel from '~app/components/common/InputLabel';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import ClusterStore from '~app/common/stores/applications/SsvWeb/Cluster.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from '~app/components/applications/SSV/FeeRecipient/FeeRecipient.styles';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';

const FeeRecipient = () => {
  const stores = useStores();
  const classes = useStyles();
  const walletStore: WalletStore = stores.Wallet;
  const clusterStore: ClusterStore = stores.Cluster;
  const applicationStore: ApplicationStore = stores.Application;
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    setUserInput(walletStore.accountAddress);
  }, []);

  const submitFeeRecipient = async () => {
    applicationStore.setIsLoading(true);
    await clusterStore.setFeeRecipient(userInput);
    applicationStore.setIsLoading(false);
  };

  const setFeeRecipient = (e: any) => {
    const textInput = e.target.value.trim();
    setUserInput(textInput);
  };

  return (
      <BorderScreen
          blackHeader
          header={'Fee Recipient Address'}
          body={[
              (
                  <Grid container item style={{ gap: 32 }}>
                    <Grid container style={{ gap: 24 }}>
                    <Grid item className={classes.Text}>
                      Enter an Ethereum address that will receive all of your validators block proposal rewards. <LinkText text={'What are proposal rewards?'} link={'http://google.com'} />
                    </Grid>
                    <Grid className={`${classes.Warning} ${classes.Text}`}>
                      Standard rewards from performing other duties will remain to be credited to your validators balance on the Beacon Chain.
                    </Grid>
                    </Grid>
                    <Grid container gap={{ gap: 24 }}>
                      <Grid item container>
                        <InputLabel title="Recipient" />
                        <TextInput
                            disable={false}
                            value={userInput}
                            onChangeCallback={setFeeRecipient}
                            data-testid="new-fee-recipient"
                            sideIcon={<Grid className={classes.EditIcon}/>}
                        />
                      </Grid>
                      <PrimaryButton text={'Update'} submitFunction={submitFeeRecipient}/>
                    </Grid>
                  </Grid>
              ),
          ]}
      />
  );
};

export default observer(FeeRecipient);