import { useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useStores } from '~app/hooks/useStores';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/PrimaryButton';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from '~app/components/applications/Faucet/RequestForSsv/RequestForSsv.styles';
import InputLabel from '~app/components/common/InputLabel';
import TextInput from '~app/components/common/TextInput';
import config from '~app/common/config';

const RequestForSsv = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const [error, setError] = useState(false);
    const applicationStore: ApplicationStore = stores.Application;
    const [buttonText, setButtonText] = useState('Request');

    const requestForSSV = () => {
        setButtonText('Requesting...');
        applicationStore.setIsLoading(true);
        setError(true);
        setTimeout(() => {
            setButtonText('Request');
            applicationStore.setIsLoading(false);
            history.push(config.routes.FAUCET.DEPLETED);
        }, 2000);
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
                value={'adsdas'}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel title="Request Amount" />
              <TextInput
                disable
                value={'100 SSV'}
                data-testid="request-amount"
                wrapperClass={classes.AmountInput}
              />
            </Grid>
            {error && <Grid item xs className={classes.ErrorText}>Something went wrong, please try again</Grid>}
            <PrimaryButton wrapperClass={classes.SubmitButton} text={buttonText} submitFunction={requestForSSV} disable={false}
              withVerifyConnection={false} />
          </Grid>,
        ]}
      />
    );
};

export default observer(RequestForSsv);
