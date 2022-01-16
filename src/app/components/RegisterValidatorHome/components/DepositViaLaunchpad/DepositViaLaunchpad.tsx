import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import config from '~app/common/config';
import PrimaryButton from '~app/common/components/PrimaryButton/PrimaryButton';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import { useStyles } from '~app/components/RegisterValidatorHome/components/CreateValidator/CreateValidator.styles';

const DepositViaLaunchpad = () => {
    const classes = useStyles();

    const redirectToLaunchpad = async () => {
        window.open(config.links.LAUNCHPAD_LINK);
    };

    return (
      <BorderScreen
        link={{ to: config.routes.VALIDATOR.IMPORT, text: 'Back' }}
        header={'Visit Ethereum Launchpad'}
        body={[
          <Grid container>
            <Grid item className={classes.Text} xs={12}>
              You must have an active validator before running it on the SSV network.
            </Grid>
            <Grid item className={classes.Text} xs={12}>
              Follow Ethereum’s launchpad instructions to generate new keys and deposit your validator to the deposit contract.
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
            <PrimaryButton text={'Visit Ethereum Launchpad'} onClick={redirectToLaunchpad} />
          </Grid>,
            ]}
        />
    );
};
export default observer(DepositViaLaunchpad);
