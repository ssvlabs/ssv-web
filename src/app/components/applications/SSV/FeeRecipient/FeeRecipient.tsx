import React from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useStyles } from '~app/components/applications/SSV/FeeRecipient/FeeRecipient.styles';
import BorderScreen from '~app/components/common/BorderScreen';
import LinkText from '~app/components/common/LinkText';
import InputLabel from '~app/components/common/InputLabel';
import TextInput from '~app/components/common/TextInput';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';

const FeeRecipient = () => {
  const classes = useStyles();
  classes;

  return (
      <BorderScreen
          blackHeader
          header={'Fee Recipient Address'}
          body={[
              (
                  <Grid container item style={{ gap: 32 }}>
                    <Grid container style={{ gap: 24 }}>
                    <Grid item className={classes.Text}>
                      Enter an Ethereum address that will receive all of your validators block proposal rewards. <LinkText text={'What are proposal rewards?'} link={'http://google.com'} />
                    </Grid>
                    <Grid className={`${classes.Warning} ${classes.Text}`}>
                      Standard rewards from performing other duties will remain to be credited to your validators balance on the Beacon Chain.
                    </Grid>
                    </Grid>
                    <Grid container gap={{ gap: 24 }}>
                      <Grid item container>
                        <InputLabel title="Recipient"/>
                        <TextInput
                            value={12}
                            disable={false}
                            data-testid="new-fee-recipient"
                            sideIcon={<Grid className={classes.EditIcon}/>}
                        />
                      </Grid>
                      <PrimaryButton disable text={'Update'} submitFunction={console.log}/>
                    </Grid>
                  </Grid>
              ),
          ]}
      />
  );
};

export default observer(FeeRecipient);