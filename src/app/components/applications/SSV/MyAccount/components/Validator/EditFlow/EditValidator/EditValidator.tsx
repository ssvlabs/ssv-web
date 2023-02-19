import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import ProcessStore, { SingleValidatorProcess } from '~app/common/stores/applications/SsvWeb/Process.store';
import SelectOperators from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators';
import ValidatorWhiteHeader from '~app/components/applications/SSV/MyAccount/common/componenets/ValidatorWhiteHeader';
import { useStyles } from './EditValidator.styles';

const EditValidator = () => {
    const stores = useStores();
    const classes = useStyles();
    const navigate = useNavigate();
    const processStore: ProcessStore = stores.Process;
    const operatorStore: OperatorStore = stores.Operator;
    const applicationStore: ApplicationStore = stores.Application;
    const process: SingleValidatorProcess = processStore.getProcess;
    const validator = process?.item;

    useEffect(() => {
        if (!validator) return navigate(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
        applicationStore.setIsLoading(true);
        operatorStore.selectOperators(validator?.operators);
        applicationStore.setIsLoading(false);
    }, []);

    return (
      <Grid container className={classes.EditValidatorWrapper}>
        <ValidatorWhiteHeader withCancel withBackButton={false} text={'Update Operators for Validator'} />
        <SelectOperators editPage />
      </Grid>
    );
};
export default observer(EditValidator);