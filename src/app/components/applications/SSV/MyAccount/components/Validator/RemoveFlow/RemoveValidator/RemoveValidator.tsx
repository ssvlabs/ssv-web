import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import Button from '~app/components/common/Button';
import BorderScreen from '~app/components/common/BorderScreen';
import Checkbox from '~app/components/common/CheckBox/CheckBox';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import ValidatorWhiteHeader from '~app/components/applications/SSV/MyAccount/common/componenets/ValidatorWhiteHeader';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Validator/RemoveFlow/RemoveValidator/RemoveValidator.styles';

const RemoveValidator = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const validatorStore: ValidatorStore = stores.Validator;
    const [validator, setValidator] = useState(null);
    const myAccountStore: MyAccountStore = stores.MyAccount;
    const applicationStore: ApplicationStore = stores.Application;
    const [removeButtonEnabled, setRemoveButtonEnabled] = useState(false);
    
    useEffect(() => {
        if (!validatorStore.processValidatorPublicKey) return history.push(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
        applicationStore.setIsLoading(true);
        myAccountStore.getValidator(validatorStore.processValidatorPublicKey).then((response: any) => {
            if (response) {
                setValidator(response);
                applicationStore.setIsLoading(false);
            }
        });
    }, []);

    const checkboxChange = () => {
        setRemoveButtonEnabled(!removeButtonEnabled);
    };

    const removeValidator = async () => {
        if (validatorStore.processValidatorPublicKey) {
            const response = await validatorStore.removeValidator(validatorStore.processValidatorPublicKey);
            if (response) history.push(config.routes.SSV.MY_ACCOUNT.VALIDATOR.VALIDATOR_REMOVE.REMOVED);
        }
    };

    if (!validator) return null;

    return (
      <Grid container item>
        <ValidatorWhiteHeader text={'Remove Validator'} />
        <BorderScreen
          blackHeader
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