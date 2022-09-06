import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { Link, Typography } from '@material-ui/core';
import { useStores } from '~app/hooks/useStores';
import config, { translations } from '~app/common/config';
import { getBaseBeaconchaUrl } from '~lib/utils/beaconcha';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import EventStore from '~app/common/stores/applications/SsvWeb/Event.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import {
  useStyles,
} from '~app/components/applications/SSV/RegisterValidatorHome/components/CreateValidator/CreateValidator.styles';

const DepositViaLaunchpad = () => {
  const stores = useStores();
  const classes = useStyles();
  const eventStore: EventStore = stores.Event;
  const validatorStore: ValidatorStore = stores.Validator;

  const redirectToLaunchpad = async () => {
    eventStore.send({ category: 'validator_register', action: 'link', label: config.links.LAUNCHPAD_LINK });
    window.open(config.links.LAUNCHPAD_LINK);
  };

  return (
    <BorderScreen
      blackHeader
      header={translations.VALIDATOR.DEPOSIT.TITLE}
      body={[
        <Grid container spacing={6}>
          <Grid item className={classes.Text} xs={12}>
            Your validator is not yet activated on the Beacon Chain.
          </Grid>
          <Grid item className={classes.Text} xs={12}>
            If you have deposited your validator recently, keep in mind that it could take up to ~24 hours until it is
            picked up by the Beacon Chain.
          </Grid>
          <Grid item className={classes.Text} xs={12}>
            You can keep track on the status of your validator activation on:
            <Link href={`${getBaseBeaconchaUrl()}/validator/${validatorStore.keyStorePublicKey}`} target="_blank">
              <Typography noWrap>
                {`${getBaseBeaconchaUrl()}/validator/${validatorStore.keyStorePublicKey}`}
              </Typography>
            </Link>
          </Grid>

          <Grid item className={classes.Text} xs={12}>
            If you haven&apos;t deposited your validator yet, follow Ethereum&apos;s launchpad instructions to deposit
            your validator to the Ethereum deposit contract.
          </Grid>
          <Grid item container xs={12}>
            <Grid item className={classes.rhinoImage} />
          </Grid>
          <PrimaryButton text={'Visit Ethereum Launchpad'} submitFunction={redirectToLaunchpad} />
        </Grid>,
      ]}
    />
  );
};
export default observer(DepositViaLaunchpad);
