import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import Button from '~app/components/common/Button';
import GoogleTagManager from '~lib/analytics/GoogleTagManager';
import BorderScreen from '~app/components/common/BorderScreen';
import Checkbox from '~app/components/common/CheckBox/CheckBox';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import ProcessStore, { SingleValidatorProcess } from '~app/common/stores/applications/SsvWeb/Process.store';
import ValidatorWhiteHeader from '~app/components/applications/SSV/MyAccount/common/componenets/ValidatorWhiteHeader';
import {
  useStyles,
} from '~app/components/applications/SSV/MyAccount/components/Validator/RemoveFlow/RemoveValidator/RemoveValidator.styles';

const RemoveValidator = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const processStore: ProcessStore = stores.Process;
  const validatorStore: ValidatorStore = stores.Validator;
  const [removeButtonEnabled, setRemoveButtonEnabled] = useState(false);
  const process: SingleValidatorProcess = processStore.getProcess;
  const validator = process?.item;
  
  useEffect(() => {
    if (!validator) return navigate(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
  }, []);

  const checkboxChange = () => {
    setRemoveButtonEnabled(!removeButtonEnabled);
  };

  const removeValidator = async () => {
    if (validator.public_key) {
      const response = await validatorStore.removeValidator(validator.public_key);
      if (response) {
        navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.VALIDATOR_REMOVE.REMOVED);
      }
    }
  };

  if (!validator) return null;

  return (
    <Grid container item>
      <ValidatorWhiteHeader text={'Remove Validator'} />
      <BorderScreen
        blackHeader
        onBackButtonClick={() => {
          GoogleTagManager.getInstance().sendEvent({
            category: 'navigate',
            action: 'my_account',
          });
        }}
        withoutNavigation
        wrapperClass={classes.Wrapper}
        sectionClass={classes.Section}
        header={'Removing your validator will:'}
        body={[
          <Grid container item>
            <Grid item>
              <ul className={classes.BulletsWrapper}>
                <li className={classes.Bullet}>Delete all records of your validator keys from the SSV
                  network.
                </li>
                <li className={classes.Bullet}> Your operators will stop operating your validator, which
                  will result in its inactivation (penalties on the beacon chain), as it will no
                  longer be maintained by the network.
                </li>
              </ul>
            </Grid>
            <Grid item>
              <Typography className={classes.SecondHeader}>Keep in mind</Typography>
              <Grid item className={classes.Warning}>
                To avoid slashing, it is advised to wait at least 2 epochs prior to running the
                validator on an alternative service.
              </Grid>
            </Grid>
            <Grid item className={classes.CheckBoxWrapper}>
              <Checkbox
                onClickCallBack={checkboxChange}
                text={'I understand that my validator will be removed from the network and it will stop attesting on the beacon chain'}
              />
              <Button
                errorButton
                text={'Remove Validator'}
                onClick={removeValidator}
                disable={!removeButtonEnabled}
              />
            </Grid>
          </Grid>,
        ]}
      />
    </Grid>
  );
};

export default observer(RemoveValidator);
