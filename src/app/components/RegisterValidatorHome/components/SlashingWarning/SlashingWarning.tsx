import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import { useStores } from '~app/hooks/useStores';
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
    const history = useHistory();
    const validatorStore: ValidatorStore = stores.Validator;
    const [userAgreed, setUserAgreed] = useState(false);

    const goToConfirmation = () => {
        history.push(config.routes.VALIDATOR.CONFIRMATION_PAGE);
    };

    return (
      <BorderScreen
        blackHeader
        header={translations.VALIDATOR.SLASHING_WARNING.TITLE}
        body={[
          <Grid container>
            <Grid item className={classes.SubHeader}>Your validator is currently active on the beacon
              chain:</Grid>
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
              submitFunction={goToConfirmation}
            />
          </Grid>,
            ]}
        />
    );
};

export default observer(SlashingWarning);
