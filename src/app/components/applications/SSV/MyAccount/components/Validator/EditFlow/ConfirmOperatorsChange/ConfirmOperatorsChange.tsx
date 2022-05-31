import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Validator from '~lib/api/Validator';
import { useStores } from '~app/hooks/useStores';
import BackNavigation from '~app/components/common/BackNavigation';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import OperatorsReceipt from '~app/components/applications/SSV/MyAccount/components/Validator/EditFlow/OperatorsRecipt';
import ValidatorWhiteHeader from '~app/components/applications/SSV/MyAccount/common/componenets/ValidatorWhiteHeader';
import { useStyles } from './ConfirmOperatorsChange.styles';

const ConfirmOperatorsChange = () => {
    const stores = useStores();
    const classes = useStyles();
    // @ts-ignore
    const { public_key } = useParams();
    const operatorStore: OperatorStore = stores.Operator;
    const [operators, setOperators] = useState(null);

    useEffect(() => {
        Validator.getInstance().getValidator(public_key).then((response: any) => {
            setOperators(response.operators);
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