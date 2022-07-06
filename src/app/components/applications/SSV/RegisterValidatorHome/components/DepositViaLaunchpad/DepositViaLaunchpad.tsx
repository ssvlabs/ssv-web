import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import EventStore from '~app/common/stores/applications/SsvWeb/Event.store';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/CreateValidator/CreateValidator.styles';

const DepositViaLaunchpad = () => {
    const stores = useStores();
    const classes = useStyles();
    const eventStore: EventStore = stores.Event;

    const redirectToLaunchpad = async () => {
        eventStore.send({ category: 'validator_register', action: 'link', label: config.links.LAUNCHPAD_LINK });
        window.open(config.links.LAUNCHPAD_LINK);
    };

    return (
      <BorderScreen
        blackHeader
        header={'Deposit Validator via Ethereum Launchpad'}
        body={[
          <Grid container>
            <Grid item className={classes.Text} xs={12}>
              You must deposit your validator before running it on the SSV network.
            </Grid>
            <Grid item className={classes.Text} xs={12}>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Follow Ethereum's launchpad instructions to deposit your validator to the deposit contract.
            </Grid>
            <Grid item className={classes.Text} xs={12}>
              There is no need to wait until your validator is active on the beacon chain,
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              you can return to register your validator to our network while it's pending on the staking queue,
              once it gets activated, your selected operators will operate it immediately.
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
