import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useStores } from '~app/hooks/useStores';
import config, { translations } from '~app/common/config';
import BorderScreen from '~app/components/common/BorderScreen';
import Checkbox from '~app/components/common/CheckBox/CheckBox';
import ValidatorKeyInput from '~app/components/common/AddressKeyInput';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import {
  useStyles,
} from '~app/components/applications/SSV/RegisterValidatorHome/components/SlashingWarning/SlashingWarning.styles';

const SlashingWarning = () => {
  const classes = useStyles();
  const stores = useStores();
  const navigate = useNavigate();
  const validatorStore: ValidatorStore = stores.Validator;
  const [userAgreed, setUserAgreed] = useState(false);

  const goToConfirmation = () => {
    navigate(config.routes.SSV.VALIDATOR.CONFIRMATION_PAGE);
  };

  return (
    <BorderScreen
      blackHeader
      header={translations.VALIDATOR.SLASHING_WARNING.TITLE}
      body={[
        <Grid container>
          <Grid item className={classes.SubHeader}>Your validator is currently active on the beacon chain:</Grid>
          <Grid item xs={12} className={classes.PublicKey}>
            <ValidatorKeyInput withBeaconcha withCopy address={validatorStore.keyStorePublicKey || validatorStore.keySharePublicKey} />
          </Grid>
          <Grid item xs={12} className={classes.Text}>
            Running a validator simultaneously to the SSV network will cause slashing to your validator.
          </Grid>
          <Grid item xs={12} className={classes.Text}>
            To avoid slashing, shut down your existing validator setup (if you have one) before importing your validator to
            run with our network.
          </Grid>
          <Checkbox
            onClickCallBack={setUserAgreed}
            text={'I understand that running my validator simultaneously in multiple setups will cause slashing to my validator'}
          />
          <PrimaryButton disable={!userAgreed} text={'Next'} dataTestId={'register-validator'}
            submitFunction={goToConfirmation}
          />
        </Grid>,
      ]}
    />
  );
};

export default observer(SlashingWarning);
