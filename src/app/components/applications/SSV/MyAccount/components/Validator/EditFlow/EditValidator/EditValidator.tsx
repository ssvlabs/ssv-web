import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ProcessStore, { SingleCluster } from '~app/common/stores/applications/SsvWeb/Process.store';
import ValidatorWhiteHeader from '~app/components/applications/SSV/MyAccount/common/ValidatorWhiteHeader';
import SelectOperators from '~app/components/applications/SSV/RegisterValidatorHome/components/SelectOperators';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/Validator/EditFlow/EditValidator/EditValidator.styles';
import { useAppDispatch } from '~app/hooks/redux.hook';
import { setIsLoading } from '~app/redux/appState.slice';

const EditValidator = () => {
    const stores = useStores();
    const classes = useStyles();
    const navigate = useNavigate();
    const processStore: ProcessStore = stores.Process;
    const operatorStore: OperatorStore = stores.Operator;
    const process: SingleCluster = processStore.getProcess;
    const validator = process?.item;
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!validator) return navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD);
        dispatch(setIsLoading(true));
        operatorStore.selectOperators(validator?.operators);
        dispatch(setIsLoading(false));
    }, []);

    return (
      <Grid container className={classes.EditValidatorWrapper}>
        <ValidatorWhiteHeader withCancel withBackButton={false} text={'Update Operators for Validator'} />
        <SelectOperators editPage />
      </Grid>
    );
};
export default observer(EditValidator);
