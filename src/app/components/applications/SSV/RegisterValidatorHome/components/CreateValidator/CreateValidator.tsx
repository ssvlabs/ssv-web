import React from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import Button from '~app/components/common/Button';
import BorderScreen from '~app/components/common/BorderScreen';
import GoogleTagManager from '~lib/analytics/GoogleTag/GoogleTagManager';
import {
  useStyles,
} from '~app/components/applications/SSV/RegisterValidatorHome/components/CreateValidator/CreateValidator.styles';
import { getLinks } from '~root/providers/networkInfo.provider';

const CreateValidator = () => {
  const classes = useStyles();

  const redirectToLaunchpad = async () => {
    GoogleTagManager.getInstance().sendEvent({
      category: 'external_link',
      action: 'click',
      label: 'Visit Ethereum Launchpad',
    });
    window.open(getLinks().LAUNCHPAD_URL);
  };

  return (
    <BorderScreen
      blackHeader
      header={'Visit Ethereum Launchpad'}
      body={[
        <Grid container>
          <Grid item className={classes.Text} xs={12}>
            You must have an active validator before running it on the SSV network.
          </Grid>
          <Grid item className={classes.Text} xs={12}>
            Follow Ethereum’s launchpad instructions to generate new keys and deposit your validator to the deposit
            contract.
          </Grid>
          <Grid item className={classes.Text} xs={12}>
            Please note to backup your newly created validator files, you will need them for our setup.
          </Grid>
          <Grid item container xs={12}>
            <Grid item className={classes.rhinoImage} />
          </Grid>
          <Button text={'Visit Ethereum Launchpad'} onClick={redirectToLaunchpad} disable={false} />
        </Grid>,
      ]}
    />
  );
};
export default observer(CreateValidator);
