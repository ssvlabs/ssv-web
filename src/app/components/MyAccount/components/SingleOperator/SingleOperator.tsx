import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useHistory, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useStores } from '~app/hooks/useStores';
import ImageDiv from '~app/common/components/ImageDiv/ImageDiv';
import Checkbox from '~app/common/components/CheckBox/CheckBox';
import WhiteWrapper from '~app/common/components/WhiteWrapper/WhiteWrapper';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import PrimaryButton from '~app/common/components/Button/PrimaryButton/PrimaryButton';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from '~app/components/MyAccount/components/RemoveValidator/RemoveValidator.styles';
import Operator from '~lib/api/Operator';

const SingleOperator = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    history;
    // @ts-ignore
    const { operator_id } = useParams();
    const validatorStore: ValidatorStore = stores.Validator;
    const [operator, setOperator] = useState(null);
    const applicationStore: ApplicationStore = stores.Application;
    const [removeButtonEnabled, setRemoveButtonEnabled] = useState(false);
    
    useEffect(() => {
        applicationStore.setIsLoading(true);
        Operator.getInstance().getOperator(operator_id).then((response: any) => {
            if (response) {
                setOperator(response);
                applicationStore.setIsLoading(false);
            }
        });
    }, []);

    const checkboxChange = () => {
        setRemoveButtonEnabled(!removeButtonEnabled);
    };

    const removeValidator = async () => {
        const response = await validatorStore.removeValidator(operator_id);
        if (response) {
            history.push(`/dashboard/validator/${operator_id}/removed`);
        } else {
            history.push(`/dashboard/validator/${operator_id}/removed`);
        }
    };

    if (!operator) return null;

    return (
      <Grid container item>
        <WhiteWrapper header={'Remove Validator'}>
          <Grid item container className={classes.SubHeaderWrapper}>
            <Typography>{operator_id}</Typography>
            <ImageDiv image={'copy'} width={24} height={24} />
            <ImageDiv image={'explorer'} width={24} height={24} />
            <ImageDiv image={'beacon'} width={24} height={24} />
          </Grid>
        </WhiteWrapper>
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
                  text={'I understand that that my validator will be removed from the network and it will stop attesting on the beacon chain'}
                />
                <PrimaryButton
                  errorButton
                  text={'Remove Validator '}
                  disable={!removeButtonEnabled}
                  submitFunction={removeValidator}
                />
              </Grid>
            </Grid>,
          ]}
        />
      </Grid>
    );
};

export default observer(SingleOperator);