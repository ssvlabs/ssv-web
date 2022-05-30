import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Validator from '~lib/api/Validator';
import { useStores } from '~app/hooks/useStores';
import ImageDiv from '~app/common/components/ImageDiv/ImageDiv';
import BackNavigation from '~app/common/components/BackNavigation';
import OperatorsReceipt from '~app/common/components/OperatorsRecipt';
import WhiteWrapper from '~app/common/components/WhiteWrapper/WhiteWrapper';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { useStyles } from './ConfirmOperatorsChange.styles';

const ConfirmOperatorsChange = () => {
    const stores = useStores();
    const classes = useStyles();
    const operatorStore: OperatorStore = stores.Operator;
    const [operators, setOperators] = useState(null);
    const notificationsStore: NotificationsStore = stores.Notifications;

    useEffect(() => {
        Validator.getInstance().getValidator(public_key).then((response: any) => {
            setOperators(response.operators);
        });
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(public_key);
        notificationsStore.showMessage('Copied to clipboard.', 'success');
    };

    // @ts-ignore
    const { public_key } = useParams();

    if (!operators) return null;

    return (
      <Grid container className={classes.Wrapper}>
        <WhiteWrapper withCancel withBackButton={false} header={'Update Operators for Validator'}>
          <Grid item container className={classes.SubHeaderWrapper}>
            <Typography>{public_key}</Typography>
            <ImageDiv onClick={copyToClipboard} image={'copy'} width={24} height={24} />
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