import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import AccountStore from '~app/common/stores/applications/SsvWeb/Account.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import ProcessStore, { RegisterValidator, SingleCluster } from '~app/common/stores/applications/SsvWeb/Process.store';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/GenerateKeyShares/GenerateKeyShares.styles';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';

const GenerateKeyShares = () => {
  const stores = useStores();
  const navigate = useNavigate();
  const { networkId } = getStoredNetwork();
  const classes = useStyles({ networkId });
  const walletStore: WalletStore = stores.Wallet;
  const accountStore: AccountStore = stores.Account;
  const processStore: ProcessStore = stores.Process;
  const validatorStore: ValidatorStore = stores.Validator;
  const process: RegisterValidator | SingleCluster = processStore.getProcess;
  process;

    useEffect(() => {
        async function getNonce() {
          return accountStore.getOwnerNonce(walletStore.accountAddress);
        }
         getNonce();
    }, []);


  const uploadKeystore = {
      true: () => navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.UPLOAD_KEY_STORE),
      false: () => navigate(config.routes.SSV.VALIDATOR.IMPORT),
  };

  const distributeOffline = {
      true: () => navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.DISTRIBUTE_OFFLINE),
      false: () => navigate(config.routes.SSV.VALIDATOR.DISTRIBUTION_METHOD.DISTRIBUTE_OFFLINE),
  };

  const MainScreen = <BorderScreen
      withoutNavigation={processStore.secondRegistration}
      body={[
        <Grid container style={{ gap: 24 }}>
          <HeaderSubHeader
              marginBottom={0.01}
              title={'Generate Validator KeyShares'}
              subtitle={<>To run a Distributed Validator you must split your validation key into <br/>
                <b>Key Shares</b> and distribute them across your selected operators to<br/>
                operate in your behalf.</>}
          />
          <Grid item className={classes.Image}/>
          <HeaderSubHeader
              marginBottom={0.01}
              subtitle={'Select your preferred method to split your key:'}
          />
          <Grid container item className={classes.LinkButtonsWrapper}>
              {networkId !== 1 && <Grid container item className={classes.LinkButtonWrapper}>
                  <SecondaryButton
                      dataTestId={'online'}
                      withVerifyConnection
                      text={'Online'}
                      submitFunction={() => {
                          validatorStore.keyStoreFile = null;
                          uploadKeystore[`${processStore.secondRegistration}`]();
                      }}
                  />
                  <Grid item xs={12} className={classes.UnderButtonText}>
                      Split key via the webapp
                  </Grid>
              </Grid>}
            <Grid container item className={classes.LinkButtonWrapper}>
              <SecondaryButton
                  dataTestId={'offline'}
                  withVerifyConnection
                  text={'Offline'}
                  submitFunction={() => {
                    validatorStore.keyShareFile = null;
                    distributeOffline[`${processStore.secondRegistration}`]();
                  }}
              />
              <Grid item xs={12} className={classes.UnderButtonText}>
                Split key on your computer
              </Grid>
            </Grid>
          </Grid>
        </Grid>,
      ]}
  />;

  if (processStore.secondRegistration) {
    return (
        <Grid container>
          <NewWhiteWrapper
              type={0}
              header={'Cluster'}
          />
          {MainScreen}
        </Grid>
    );
  }

  return MainScreen;
};

export default observer(GenerateKeyShares);
