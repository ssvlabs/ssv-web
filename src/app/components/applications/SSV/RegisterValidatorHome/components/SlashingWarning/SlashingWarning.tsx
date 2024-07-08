import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { Location, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useStores } from '~app/hooks/useStores';
import config, { translations } from '~app/common/config';
import BorderScreen from '~app/components/common/BorderScreen';
import Checkbox from '~app/components/common/CheckBox/CheckBox';
import ValidatorKeyInput from '~app/components/common/AddressKeyInput';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import NewWhiteWrapper, { WhiteWrapperDisplayType } from '~app/components/common/NewWhiteWrapper/NewWhiteWrapper';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/SlashingWarning/SlashingWarning.styles';
import { PrimaryButton } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum';
import { useAppSelector } from '~app/hooks/redux.hook.ts';
import { getIsClusterSelected } from '~app/redux/account.slice.ts';
import { NewValidatorRouteState } from '~app/Routes';

const SlashingWarning = () => {
  const classes = useStyles();
  const stores = useStores();
  const navigate = useNavigate();
  const location: Location<NewValidatorRouteState> = useLocation();
  const validatorStore: ValidatorStore = stores.Validator;
  const [hasUserAgreed, setHasUserAgreed] = useState(false);
  const publicKey = validatorStore.keyStorePublicKey || validatorStore.keySharePublicKey;
  const isSecondRegistration = useAppSelector(getIsClusterSelected);

  const goToConfirmation = () => {
    if (isSecondRegistration) {
      navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.CONFIRMATION_PAGE, { state: location.state });
    } else {
      navigate(config.routes.SSV.VALIDATOR.CONFIRMATION_PAGE, { state: location.state });
    }
  };

  const SingleSlashingPublicKey = (
    <>
      <Grid item className={classes.SubHeader}>
        Validator Public Key
      </Grid>
      <Grid item xs={12} className={classes.PublicKey}>
        <ValidatorKeyInput withBeaconcha withCopy address={publicKey} />
      </Grid>
    </>
  );

  const MainScreen = (
    <BorderScreen
      blackHeader
      withoutNavigation={isSecondRegistration}
      header={translations.VALIDATOR.SLASHING_WARNING.TITLE}
      body={[
        <Grid container>
          {!validatorStore.isMultiSharesMode && SingleSlashingPublicKey}
          <Grid item xs={12} className={classes.Text}>
            Running a validator simultaneously to the SSV network will cause slashing to your validator.
          </Grid>
          <Grid item xs={12} className={classes.Text}>
            To avoid slashing, shut down your existing validator setup (if you have one) before importing your validator to run with our network.
          </Grid>
          <Checkbox
            toggleIsChecked={() => setHasUserAgreed(!hasUserAgreed)}
            isChecked={hasUserAgreed}
            text={'I understand that running my validator simultaneously in multiple setups will cause slashing to my validator'}
          />
          <PrimaryButton isDisabled={!hasUserAgreed} text={'Next'} onClick={goToConfirmation} size={ButtonSize.XL} />
        </Grid>
      ]}
    />
  );

  if (isSecondRegistration) {
    return (
      <Grid container>
        <NewWhiteWrapper type={WhiteWrapperDisplayType.VALIDATOR} header={'Cluster'} />
        {MainScreen}
      </Grid>
    );
  }

  return MainScreen;
};

export default observer(SlashingWarning);
