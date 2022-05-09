import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { useStores } from '~app/hooks/useStores';
import ImageDiv from '~app/common/components/ImageDiv/ImageDiv';
import OperatorsReceipt from '~app/common/components/OperatorsRecipt';
// import ApplicationStore from '~app/common/stores/Abstracts/Application';
import Validator from '~lib/api/Validator';
import BackNavigation from '~app/common/components/BackNavigation';
import WhiteWrapper from '~app/common/components/WhiteWrapper/WhiteWrapper';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import { useStyles } from './ConfirmOperatorsChange.styles';

const ConfirmOperatorsChange = () => {
    const stores = useStores();
    const classes = useStyles();
    const [operators, setOperators] = useState(null);
    const operatorStore: OperatorStore = stores.Operator;

    useEffect(() => {
        Validator.getInstance().getValidator(public_key).then((response: any) => {
            setOperators(response.operators);
        });
    }, []);

    // @ts-ignore
    const { public_key } = useParams();

    if (!operators) return null;

    return (
      <Grid container className={classes.Wrapper}>
        <WhiteWrapper withCancel withBackButton={false} header={'Update Operators for Validator'}>
          <Grid item container className={classes.SubHeaderWrapper}>
            <Typography>{public_key}</Typography>
            <ImageDiv image={'copy'} width={24} height={24} />
            <ImageDiv image={'explorer'} width={24} height={24} />
            <ImageDiv image={'beacon'} width={24} height={24} />
          </Grid>
        </WhiteWrapper>
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