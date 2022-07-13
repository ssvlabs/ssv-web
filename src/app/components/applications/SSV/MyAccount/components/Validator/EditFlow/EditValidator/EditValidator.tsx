import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import config from '~app/common/config';
import Validator from '~lib/api/Validator';
import { useStores } from '~app/hooks/useStores';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import SelectOperators from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators';
import ValidatorWhiteHeader from '~app/components/applications/SSV/MyAccount/common/componenets/ValidatorWhiteHeader';
import { useStyles } from './EditValidator.styles';

const EditValidator = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const operatorStore: OperatorStore = stores.Operator;
    const validatorStore: ValidatorStore = stores.Validator;
    const applicationStore: ApplicationStore = stores.Application;

    useEffect(() => {
        if (!validatorStore.processValidatorPublicKey) return history.push(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
        applicationStore.setIsLoading(true);
        Validator.getInstance().getValidator(validatorStore.processValidatorPublicKey).then((response: any) => {
            if (response) {
                operatorStore.selectOperators(response?.operators);
                applicationStore.setIsLoading(false);
            }
        });
    }, []);

    return (
      <Grid container className={classes.EditValidatorWrapper}>
        <ValidatorWhiteHeader withCancel withBackButton={false} text={'Update Operators for Validator'} />
        <SelectOperators editPage />
      </Grid>
    );
};
export default observer(EditValidator);