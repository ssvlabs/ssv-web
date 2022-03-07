import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import { useStores } from '~app/hooks/useStores';
import useUserFlow from '~app/hooks/useUserFlow';
import config, { translations } from '~app/common/config';
import Checkbox from '~app/common/components/CheckBox/CheckBox';
import ValidatorKeyInput from '~app/common/components/AddressKeyInput';
import PrimaryButton from '~app/common/components/Buttons/PrimaryButton';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import { useStyles } from '~app/components/RegisterValidatorHome/components/SlashingWarning/SlashingWarning.styles';

const SlashingWarning = () => {
  const classes = useStyles();
  const stores = useStores();
    const { redirectUrl, history } = useUserFlow();
    const validatorStore: ValidatorStore = stores.Validator;
    const [userAgreed, setUserAgreed] = useState(false);

  useEffect(() => {
    redirectUrl && history.push(redirectUrl);
  }, [redirectUrl]);

  const goToConfirmation = () => {
      history.push(config.routes.VALIDATOR.CONFIRMATION_PAGE);
  };
  const linkTo = process.env.REACT_APP_NEW_STAGE ? config.routes.VALIDATOR.ACCOUNT_BALANCE_AND_FEE : config.routes.VALIDATOR.SELECT_OPERATORS;
    return (
      <BorderScreen
        blackHeader
        navigationLink={linkTo}
        header={translations.VALIDATOR.SLASHING_WARNING.TITLE}
        body={[
          <Grid container>
            <Grid item className={classes.SubHeader}>Your validator is currently active on the beacon chain:</Grid>
            <Grid item xs={12} className={classes.PublicKey}>
              <ValidatorKeyInput withBeaconcha withCopy address={validatorStore.keyStorePublicKey} />
            </Grid>
            <Grid item xs={12} className={classes.Text}>
              Running a validator simultaneously to the SSV network will cause slashing to your validator.
            </Grid>
            <Grid item xs={12} className={classes.Text}>
              To avoid slashing, shut down your existing validator setup before importing your validator to
              run with our network.
            </Grid>
            <Checkbox
              text={'I understand that running my validator simultaneously in multiple setups will cause slashing to my validator'}
              onClickCallBack={setUserAgreed}
            />
            <PrimaryButton disable={!userAgreed} text={'Next'} dataTestId={'register-validator'}
              submitFunction={goToConfirmation} />
          </Grid>,
        ]}
      />
    );
};

export default observer(SlashingWarning);
