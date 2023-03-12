import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import Button from '~app/components/common/Button';
import { useStyles } from './RemoveValidator.styles';
import BorderScreen from '~app/components/common/BorderScreen';
// import Checkbox from '~app/components/common/CheckBox/CheckBox';
import AddressKeyInput from '~app/components/common/AddressKeyInput';
import NewWhiteWrapper from '~app/components/common/NewWhiteWrapper';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import ProcessStore, { SingleCluster } from '~app/common/stores/applications/SsvWeb/Process.store';

const RemoveValidator = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const processStore: ProcessStore = stores.Process;
  const validatorStore: ValidatorStore = stores.Validator;
  // const [removeButtonEnabled, setRemoveButtonEnabled] = useState(false);
  const process: SingleCluster = processStore.getProcess;
  const validator = process?.validator;

  useEffect(() => {
    if (!validator) return navigate(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
  }, []);

  // const checkboxChange = () => {
  //   setRemoveButtonEnabled(!removeButtonEnabled);
  // };

  const removeValidator = async () => {
    if (validator.public_key) {
      const response = await validatorStore.removeValidator(validator);
      if (response) {
        navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.VALIDATOR_REMOVE.REMOVED);
      }
    }
  };

  if (!validator) return null;

  return (
    <Grid container item>
      <NewWhiteWrapper type={0} header={'Cluster'} />
      <BorderScreen
        withoutNavigation
        wrapperClass={classes.Wrapper}
        sectionClass={classes.Section}
        header={'Remove Validator'}
        body={[
          <Grid container item style={{ gap: 24 }}>
            <Grid container item style={{ gap: 8 }}>
              <Grid item className={classes.GrayText}>Validator Public Key</Grid>
              <AddressKeyInput withBeaconcha address={`0x${validator.public_key}`} />
            </Grid>
            <Grid container item style={{ gap: 16 }}>
              <Grid className={classes.BulletText}>
                Removing your validator will cause your operators to stop managing it in your behalf, which will result in its inactivation (penalties on the Beacon Chain).
              </Grid>
              <Grid className={classes.BulletText}>
                Please note that this action only applies to its removal from our network and does not exit your validator from the Beacon Chain.
              </Grid>
            </Grid>
              <Grid item className={classes.Warning}>
                To avoid slashing, it is advised to wait at least 2 epochs prior to running the
                validator on an alternative service.
              </Grid>
              <Grid container item>
                {/*<Checkbox*/}
                {/*    onClickCallBack={checkboxChange}*/}
                {/*    text={'I understand that my validator will be removed from the network and it will stop attesting on the beacon chain'}*/}
                {/*/>*/}
                <Button
                    errorButton
                    text={'Remove Validator'}
                    onClick={removeValidator}
                    disable={false}
                />
              </Grid>
          </Grid>,
        ]}
      />
    </Grid>
  );
};

export default observer(RemoveValidator);
