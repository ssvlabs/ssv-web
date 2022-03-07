import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import config from '~app/common/config';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import PrimaryButton from '~app/common/components/Buttons/PrimaryButton/PrimaryButton';
import { useStyles } from '~app/components/RegisterValidatorHome/components/CreateValidator/CreateValidator.styles';

const DepositViaLaunchpad = () => {
    const classes = useStyles();

    const redirectToLaunchpad = async () => {
        window.open(config.links.LAUNCHPAD_LINK);
    };

    return (
      <BorderScreen
        blackHeader
        navigationLink={config.routes.VALIDATOR.IMPORT}
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
