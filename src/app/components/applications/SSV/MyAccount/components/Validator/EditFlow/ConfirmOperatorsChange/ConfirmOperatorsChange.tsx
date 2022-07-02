import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import config from '~app/common/config';
import Validator from '~lib/api/Validator';
import { useStores } from '~app/hooks/useStores';
import BackNavigation from '~app/components/common/BackNavigation';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ValidatorStore from '~app/common/stores/applications/SsvWeb/Validator.store';
import OperatorsReceipt from '~app/components/applications/SSV/MyAccount/components/Validator/EditFlow/OperatorsRecipt';
import ValidatorWhiteHeader from '~app/components/applications/SSV/MyAccount/common/componenets/ValidatorWhiteHeader';
import { useStyles } from './ConfirmOperatorsChange.styles';

const ConfirmOperatorsChange = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const operatorStore: OperatorStore = stores.Operator;
    const validatorStore: ValidatorStore = stores.Validator;
    const [operators, setOperators] = useState(null);

    useEffect(() => {
        if (!validatorStore.processValidatorPublicKey) return history.push(config.routes.SSV.MY_ACCOUNT.DASHBOARD);
        Validator.getInstance().getValidator(validatorStore.processValidatorPublicKey).then((validator: any) => {
            setOperators(validator.operators);
        });
    }, []);

    if (!operators) return null;

    return (
      <Grid container className={classes.Wrapper}>
        <ValidatorWhiteHeader withCancel withBackButton={false} text={'Update Operators for Validator'} />
        <Grid container item className={classes.BottomWrapper}>
          <Grid item xs={12}>
            <BackNavigation />
          </Grid>
          <Grid container item className={classes.TableWrapper}>
            <Grid item className={classes.Table}>
              <OperatorsReceipt operators={operators} currentOperators header={'Current Operators'} />
            </Grid>
            <Grid item className={classes.Table}>
              <OperatorsReceipt previousOperators={operators} operators={Object.values(operatorStore.selectedOperators)} header={'New Operators'} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
};

export default observer(ConfirmOperatorsChange);