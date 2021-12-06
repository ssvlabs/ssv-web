import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import config from '~app/common/config';
import PrimaryButton from '~app/common/components/PrimaryButton/PrimaryButton';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import { useStyles } from '~app/components/RegisterValidatorHome/components/CreateValidator/CreateValidator.styles';

const CreateValidator = () => {
  const classes = useStyles();

  const redirectToLaunchpad = async () => {
    window.open(config.links.LAUNCHPAD_LINK);
  };

      return (
        <BorderScreen
          link={{ to: config.routes.MY_ACCOUNT.DASHBOARD, text: 'Back' }}
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
                Please note to backup your newly created validator files, you will need them for our setup.
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
export default observer(CreateValidator);
